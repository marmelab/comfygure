import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Login from './Login';

const App = () => (
    <MuiThemeProvider>
        <Login />
    </MuiThemeProvider>
);

export default App;
