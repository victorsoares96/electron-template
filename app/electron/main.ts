/* eslint-disable global-require */
import fs from 'fs';
import crypto from 'crypto';
import { app, BrowserWindow, protocol, session, ipcMain, Menu } from 'electron';
// import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as i18nextBackend from 'i18next-electron-fs-backend';
import i18nextMainBackend from '@localization/i18n.main-config';

import path from 'path';
import MenuBuilder from './menu';
import { Utils } from './utils';

import Protocol from './protocol';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SecureElectronLicenseKeys = require('secure-electron-license-keys');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Store = require('secure-electron-store').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ContextMenu = require('secure-electron-context-menu').default;

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;

const port = 40992;
const selfHost = `http://localhost:${port}`;
const isDev = Utils.isDev();

let menuBuilder: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Use saved config values for configuring your
// BrowserWindow, for instance.
// NOTE - this config is not passcode protected
// and stores plaintext values
// let savedConfig = store.mainInitialStore(fs);
const createWindow = () => {
  if (!isDev) {
    // Needs to happen before creating/loading the browser window;
    // protocol is only used in prod
    protocol.registerBufferProtocol(
      Protocol.scheme,
      Protocol.requestHandler,
    ); /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
  }

  const store = new Store({
    path: app.getPath('userData'),
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: isDev,
      // allowRunningInsecureContent: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      // safeDialogs: true,
      sandbox: false,
      // webSecurity: true,
      // webviewTag: false,
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: 'Auxclick',
      additionalArguments: [
        `--storePath=${store.sanitizePath(app.getPath('userData'))}`,
      ],
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Sets up main.js bindings for our i18next backend
  i18nextBackend.mainBindings(ipcMain, mainWindow, fs);

  // Sets up main.js bindings for our electron store;
  // callback is optional and allows you to use store in main process
  const callback = function (success: boolean, initialStore: unknown) {
    console.log(
      `${!success ? 'Un-s' : 'S'}uccessfully retrieved store in main process.`,
    );
    console.log(initialStore); // {"key1": "value1", ... }
  };

  store.mainBindings(ipcMain, mainWindow, fs, callback);

  // Sets up bindings for our custom context menu
  ContextMenu.mainBindings(ipcMain, mainWindow, Menu, isDev, {
    loudAlertTemplate: [
      {
        id: 'loudAlert',
        label: 'AN ALERT!',
      },
    ],
    softAlertTemplate: [
      {
        id: 'softAlert',
        label: 'Soft alert',
      },
    ],
  });

  // Setup bindings for offline license verification
  SecureElectronLicenseKeys.mainBindings(ipcMain, mainWindow, fs, crypto, {
    root: process.cwd(),
    version: app.getVersion(),
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    console.log(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadURL(`${Protocol.scheme}://rse/index.html`);
    /* mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    ); */
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle(
      `Getting started with electron-template (v${app.getVersion()})`,
    );
  });

  // Only do these things when in development
  if (isDev) {
    // Errors are thrown if the dev tools are opened
    // before the DOM is ready
    mainWindow.webContents.once('dom-ready', async () => {
      /**
       * ! Disabled
       * https://github.com/electron/electron/issues/32133
       * https://github.com/electron/electron/issues/36545
       */
      /* await installExtension([
        REDUX_DEVTOOLS,
        REACT_DEVELOPER_TOOLS
      ], { loadExtensionOptions: { allowFileAccess: true } })
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log("An error occurred: ", err))
        .finally(() => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("electron-debug")(); // https://github.com/sindresorhus/electron-debug
          mainWindow.webContents.openDevTools();
        }); */
    });
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = 'default';
  ses
    .fromPartition(
      partition,
    ) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions: string[] = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`,
        );

        permCallback(false); // Deny
      }
    });

  /* if (!isDev) {
    ses.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            'base-uri \'self\'',
            'object-src \'none\'',
            'script-src \'self\'',
            'style-src \'self\'',
            'frame-src \'none\'',
            'worker-src \'none\'',
          ]
        }
      })
    })
  } */

  // https://electronjs.org/docs/tutorial/security#1-only-load-secure-content;
  // The below code can only run when a scheme and host are defined, I thought
  // we could use this over _all_ urls
  // ses.fromPartition(partition).webRequest.onBeforeRequest({urls:["http://localhost./*"]}, (listener) => {
  //   if (listener.url.indexOf("http://") >= 0) {
  //     listener.callback({
  //       cancel: true
  //     });
  //   }
  // });

  menuBuilder = MenuBuilder(mainWindow, app.name);

  // Set up necessary bindings to update the menu items
  // based on the current language selected
  i18nextMainBackend.on('initialized', () => {
    i18nextMainBackend.changeLanguage('en');
    i18nextMainBackend.off('initialized'); // Remove listener to this event as it's not needed anymore
  });

  // When the i18n framework starts up, this event is called
  // (presumably when the default language is initialized)
  // BEFORE the "initialized" event is fired - this causes an
  // error in the logs. To prevent said error, we only call the
  // below code until AFTER the i18n framework has finished its
  // "initialized" event.
  i18nextMainBackend.on('languageChanged', lng => {
    if (i18nextMainBackend.isInitialized) {
      console.log('Changed language to: ', lng);
      menuBuilder.buildMenu(i18nextMainBackend);
    }
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    i18nextBackend.clearMainBindings(ipcMain);
    ContextMenu.clearMainBindings(ipcMain);
    SecureElectronLicenseKeys.clearMainBindings(ipcMain);
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to navigate to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`,
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on('will-redirect', (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins: string[] = [];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`,
      );

      contentsEvent.preventDefault();
    }
  });

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on('will-attach-webview', (contentsEvent, webPreferences) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Verify URL being loaded
    /* if (!params.src.startsWith('https://example.com/')) {
      event.preventDefault()
    } */
  });

  // https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const validOrigins: string[] = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`,
      );

      return {
        action: 'deny',
      };
    }

    return {
      action: 'allow',
    };
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
