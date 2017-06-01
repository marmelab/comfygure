import React from 'react';
import PropTypes from 'proptypes';
import compose from 'recompose/compose';
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
        backgroundColor: 'rgb(232, 232, 232)',
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

export const AppComponent = ({
    state: { environmentName, environments = [], isLoggedIn = true, origin, projectId, passphrase, token },
    effects: { setEnvironment },
}) => (
    <MuiThemeProvider>
        <div style={styles.root}>
            <AppBar title="Comfy" />
            {!isLoggedIn && <Login origin={origin} projectId={projectId} passphrase={passphrase} token={token} />}
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

AppComponent.propTypes = {
    state: PropTypes.shape({
        environmentName: PropTypes.string,
        environments: PropTypes.arrayOf(PropTypes.object),
        isLoggedIn: PropTypes.bool.isRequired,
    }).isRequired,
    effects: PropTypes.shape({
        setEnvironment: PropTypes.func.isRequired,
    }).isRequired,
};

const enhance = compose(provideAppState, injectState);

export default enhance(AppComponent);
