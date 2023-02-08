import path from 'path';
import { app, BrowserWindow, ipcMain, protocol, session } from 'electron';

import { Utils } from './utils';

import Protocol from './protocol';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const port = 40992;
const selfHost = `http://localhost:${port}/main_window`;
const isDev = Utils.isDev();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  if (!isDev) {
    // Needs to happen before creating/loading the browser window;
    // protocol is only used in prod
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler); /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    title: "Application is currently initializing...",
    webPreferences: {
      // devTools: isDev,
      allowRunningInsecureContent: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      safeDialogs: true,
      sandbox: true,
      webSecurity: true,
      webviewTag: false,
      disableBlinkFeatures: 'Auxclick',
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL(selfHost);
  } else {
    mainWindow.loadURL(`${Protocol.scheme}://rse/index.html`);
  }

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.setTitle(`Getting started with electron-template (v${app.getVersion()})`);
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = "default";
  ses.fromPartition(partition) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions: string[] = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
        );

        permCallback(false); // Deny
      }
    });

  /*if (!isDev) {
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
  }*/

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

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([{
  scheme: Protocol.scheme,
  privileges: {
    standard: true,
    secure: true
  }
}]);

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
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to navigate to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on("will-redirect", (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins: string[] = [selfHost];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on("will-attach-webview", (contentsEvent, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Verify URL being loaded
    /*if (!params.src.startsWith('https://example.com/')) {
      event.preventDefault()
    }*/
  });

  // https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
  contents.setWindowOpenHandler(({
    url
  }) => {
    const parsedUrl = new URL(url);
    const validOrigins: string[] = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`
      );

      return {
        action: "deny"
      };
    }

    return {
      action: "allow"
    };
  });
});

ipcMain.on('get-preload-path', (e) => {
  e.returnValue = MAIN_WINDOW_WEBPACK_ENTRY;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
