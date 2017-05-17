import React from 'react';
import PropTypes from 'proptypes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { injectState } from 'freactal';
import AppBar from 'material-ui/AppBar';

import provideAppState from './provideAppState';
import Environment from './Environment';
import Login from './Login';
import Sidebar from './Sidebar';

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
    environmentContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
    },
};

const App = ({ environment = { name: 'development' }, environments = [], isLoggedIn = true }) => (
    <MuiThemeProvider>
        <div style={styles.root}>
            <AppBar title="Comfy" />
            {!isLoggedIn && <Login />}
            {isLoggedIn &&
                <div style={styles.container}>
                    <Sidebar environments={environments} />
                    <div style={styles.environmentContainer}>
                        <Environment environment={environment} />
                    </div>
                </div>}
        </div>
    </MuiThemeProvider>
);

App.propTypes = {
    environments: PropTypes.arrayOf(PropTypes.object),
    environment: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired,
};

export default provideAppState(
    injectState(({ state: { token, secret, environments } }) => (
        <App environments={environments} isLoggedIn={!!token && !!secret} />
    )),
);
