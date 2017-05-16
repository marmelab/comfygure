import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'babel-core/register';
import 'babel-polyfill';

import App from './App';

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
