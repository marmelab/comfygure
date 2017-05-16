import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { provideState, injectState, softUpdate } from "freactal";

import provideAppState from './provideAppState';
import Login from './Login';

const App = ({ token, secret }) => (
    <MuiThemeProvider>
        <div>
            <div>token: {token}</div>
            <div>secret: {secret}</div>
            { (!token || !secret) && <Login />}
        </div>
    </MuiThemeProvider>
);

export default provideAppState(injectState(({ state: { token, secret } }) => <App token={token} secret={secret} />));
