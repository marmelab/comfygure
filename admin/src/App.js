import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { provideState, softUpdate } from "freactal";

import provideAppState from './provideAppState';
import Login from './Login';


const App = () => (
    <MuiThemeProvider>
        <Login />
    </MuiThemeProvider>
);

export default provideAppState(App);
