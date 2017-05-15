import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Login from './Login';

const App = () => (
    <MuiThemeProvider>
        <Login />
    </MuiThemeProvider>
);

export default App;
