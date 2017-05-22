import 'babel-core/register';
import 'babel-polyfill';

import { createSpy } from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('<App />', () => {
    global.sessionStorage = {
        getItem: createSpy(),
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
    });
});
