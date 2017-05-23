import 'babel-core/register';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';

injectTapEventPlugin();

const { origin, projectId, token, passphrase } = window.config || {};

ReactDOM.render(
    <App origin={origin} projectId={projectId} token={token} passphrase={passphrase} />,
    document.getElementById('root'),
);
