import React from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const App = () => (
    <Card>
        <CardTitle
            title="comfy admin"
            subtitle="enter your token and secret"
        >
        </CardTitle>
        <CardText>
            <form>
                <TextField
                    name="token"
                    floatingLabelText="token"
                    fullWidth
                />
                <TextField
                    name="secret"
                    floatingLabelText="secret"
                    fullWidth
                />
            </form>
        </CardText>
        <CardActions>
            <RaisedButton label="Submit" primary />
        </CardActions>
    </Card>
);

export default App;
