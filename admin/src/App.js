import React from 'react';
import PropTypes from 'proptypes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { injectState } from 'freactal';
import AppBar from 'material-ui/AppBar';

import provideAppState from './provideAppState';
import Environment from './Environment';
import Login from './Login';
import Sidebar from './components/Sidebar';

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

export const App = ({ environmentName, environments = [], isLoggedIn = true, setEnvironment }) => (
    <MuiThemeProvider>
        <div style={styles.root}>
            <AppBar title="Comfy" />
            {!isLoggedIn && <Login />}
            {isLoggedIn &&
                <div style={styles.container}>
                    <Sidebar
                        activeEnvironment={environmentName}
                        environments={environments}
                        onEnvironmentSelected={setEnvironment}
                    />
                    <div style={styles.environmentContainer}>
                        <Environment />
                    </div>
                </div>}
        </div>
    </MuiThemeProvider>
);

App.propTypes = {
    environmentName: PropTypes.string,
    environments: PropTypes.arrayOf(PropTypes.object),
    isLoggedIn: PropTypes.bool.isRequired,
    setEnvironment: PropTypes.func.isRequired,
};

export default provideAppState(
    injectState(({ state: { environmentName, environments, secret, token }, effects: { setEnvironment } }) => (
        <App
            environments={environments}
            environmentName={environmentName}
            isLoggedIn={!!token && !!secret}
            setEnvironment={setEnvironment}
        />
    )),
);
