import React from 'react';
import PropTypes from 'proptypes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { injectState } from 'freactal';

import provideAppState from './provideAppState';
import Login from './Login';

const App = ({ token, secret }) => (
    <MuiThemeProvider>
        <div>
            <div>token: {token}</div>
            <div>secret: {secret}</div>
            {(!token || !secret) && <Login />}
        </div>
    </MuiThemeProvider>
);

App.propTypes = {
    token: PropTypes.string,
    secret: PropTypes.string,
};

export default provideAppState(injectState(({ state: { token, secret } }) => <App token={token} secret={secret} />));
