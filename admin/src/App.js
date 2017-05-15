import React from 'react';
import PropTypes from 'proptypes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { injectState } from 'freactal';
import AppBar from 'material-ui/AppBar';
import provideAppState from './provideAppState';
import Sidebar from './Sidebar';
import Environment from './Environment';
import Login from './Login';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        position: 'fixed',
    },
    container: {
        display: 'flex',
        flexGrow: 2,
    },
};

const environments = [{ name: 'development' }, { name: 'production' }, { name: 'staging' }];

const environment = environments[0];

const config = {
    database: {
        host: 'foo',
        port: 5000,
        user: 'toto',
        password: 'oh damn',
    },
    api: {
        url: 'http://api.com',
    },
};

const App = ({ isLoggedIn = true }) => (
    <MuiThemeProvider>
        <div style={styles.root}>
            <AppBar title="Comfy" />
            {!isLoggedIn && <Login />}
            {isLoggedIn &&
                <div style={styles.container}>
                    <Sidebar environments={environments} />
                    <Environment environment={environment} config={config} />
                </div>}
        </div>
    </MuiThemeProvider>
);

App.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

export default provideAppState(injectState(({ state: { token, secret } }) => <App isLoggedIn={token && secret} />));
