import 'babel-core/register';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';

injectTapEventPlugin();

const localeConfig = config || {};

ReactDOM.render(
    <App projectId={localeConfig.projectId} token={localeConfig.token} secret={localeConfig.secret} />,
    document.getElementById('root'),
);
