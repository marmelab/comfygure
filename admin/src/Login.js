import React from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { injectState } from "freactal";

export const Login = ({ token, secret, onSecretChange, onTokenChange }) => (
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
                    value={token}
                    floatingLabelText="token"
                    fullWidth
                    onChange={onTokenChange}
                />
                <TextField
                    name="secret"
                    value={secret}
                    floatingLabelText="secret"
                    fullWidth
                    onChange={onSecretChange}
                />
            </form>
        </CardText>
        <CardActions>
            <RaisedButton label="Submit" primary />
        </CardActions>
    </Card>
);

export default injectState(({
    state: { token, secret },
    effects,
}) => (
    <Login
        token={token}
        secret={secret}
        onSecretChange={effects.onSecretChange}
        onTokenChange={effects.onTokenChange}
    />
));
