import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { provideState, softUpdate } from "freactal";

import Login from './Login';

const wrapComponentWithState = provideState({
    initialState: () => ({
        token: '',
        secret: '',
    }),
    effects: {
        onTokenChange: softUpdate((state, event, token) => ({
            token,
        })),
        onSecretChange: softUpdate((state, event, secret) => ({
            secret,
        })),
    },
});

const App = () => (
    <MuiThemeProvider>
        <Login />
    </MuiThemeProvider>
);

export default wrapComponentWithState(App);
