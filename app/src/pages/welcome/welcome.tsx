import React from 'react';
import ROUTES from '@src/constants/routes.json';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <>
      <section className="section">
        <div className="container">
          <section className="hero is-info">
            <div className="hero-body">
              <p className="title">
                Thank you for trying out the secure-electron-template!
              </p>
              <p className="subtitle">
                Please navigate to view the features of this template.
              </p>
            </div>
          </section>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="title is-2">Samples</h2>
          <div>
            <Link to={ROUTES.MOTD}>Using the Electron store.</Link> <br />
            <Link to={ROUTES.LOCALIZATION}>Changing locales.</Link> <br />
            <Link to={ROUTES.UNDOREDO}>Undo/redoing actions.</Link> <br />
            <Link to={ROUTES.CONTEXTMENU}>Custom context menu.</Link> <br />
            <Link to={ROUTES.IMAGE}>Sample image loaded.</Link> <br />
          </div>
        </div>
      </section>
    </>
  );
}

export default Welcome;
