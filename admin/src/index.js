import 'babel-core/register';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';

injectTapEventPlugin();

const config = config || {};

ReactDOM.render(
    <App projectId={config.projectId} token={config.token} secret={config.secret} />,
    document.getElementById('root'),
);
