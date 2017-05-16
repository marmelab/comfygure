import React from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { injectState } from "freactal";

import provideLoginState from './provideLoginState';

export const Login = ({ token, secret, onSecretChange, onTokenChange, submit }) => (
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
            <RaisedButton label="Submit" primary onClick={submit} />
        </CardActions>
    </Card>
);

export default provideLoginState(injectState(({
    state,
    effects,
}) => (
    <Login
        token={state.token}
        secret={state.secret}
        onSecretChange={effects.onSecretChange}
        onTokenChange={effects.onTokenChange}
        submit={effects.submit}
    />
)));
