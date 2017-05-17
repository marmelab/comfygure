import React from 'react';
import PropTypes from 'proptypes';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { injectState } from 'freactal';

import provideLoginState from './provideLoginState';
import Alert from './components/Alert';

export const Login = ({
    token,
    secret,
    projectId,
    error,
    onSecretChange,
    onTokenChange,
    onProjectIdChange,
    submit,
}) => (
    <Card>
        <CardTitle title="comfy admin" subtitle="enter your token and secret" />
        <CardText>
            <Alert message={error} />
            <form>
                <TextField
                    name="projectId"
                    value={projectId}
                    floatingLabelText="project id"
                    fullWidth
                    onChange={onProjectIdChange}
                />
                <TextField name="token" value={token} floatingLabelText="token" fullWidth onChange={onTokenChange} />
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

Login.propTypes = {
    projectId: PropTypes.string,
    token: PropTypes.string,
    secret: PropTypes.string,
    error: PropTypes.string,
    onProjectIdChange: PropTypes.func.isRequired,
    onSecretChange: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
};

export default provideLoginState(
    injectState(({ state: { projectId, token, secret }, effects }) => (
        <Login
            projectId={projectId}
            token={token}
            secret={secret}
            onSecretChange={effects.onSecretChange}
            onTokenChange={effects.onTokenChange}
            onProjectIdChange={effects.onProjectIdChange}
            submit={() => effects.submit({ projectId, token, secret })}
        />
    )),
);
