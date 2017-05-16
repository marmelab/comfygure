import React from 'react';
import PropTypes from 'proptypes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { injectState } from 'freactal';
import AppBar from 'material-ui/AppBar';

import provideAppState from './provideAppState';
import Environment from './Environment';
import Login from './Login';
import Sidebar from './Sidebar';
import Tags from './Tags';

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

const environments = [{ name: 'development' }, { name: 'production' }, { name: 'staging' }];

const environment = environments[0];

const tags = [{ name: 'latest' }, { name: '1.0.0' }, { name: '0.0.1' }];

const tag = tags[0];

const App = ({ isLoggedIn = true }) => (
    <MuiThemeProvider>
        <div style={styles.root}>
            <AppBar title="Comfy" />
            {!isLoggedIn && <Login />}
            {isLoggedIn &&
                <div style={styles.container}>
                    <Sidebar environments={environments} />
                    <div style={styles.environmentContainer}>
                        <Tags environment={environment} tags={tags} tag={tag} />
                        <Environment environment={environment} />
                    </div>
                </div>}
        </div>
    </MuiThemeProvider>
);

App.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

export default provideAppState(injectState(({ state: { token, secret } }) => <App isLoggedIn={token && secret} />));
