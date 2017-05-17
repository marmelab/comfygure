import React from 'react';
import PropTypes from 'proptypes';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { injectState } from 'freactal';

import provideLoginState from './provideLoginState';
import Alert from './components/Alert';

export const Login = ({
    origin,
    token,
    secret,
    projectId,
    error,
    onOriginChange,
    loading,
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
                    name="origin"
                    value={origin}
                    floatingLabelText="origin"
                    fullWidth
                    onChange={onOriginChange}
                />
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
            <RaisedButton primary disabled={loading} onClick={submit}>
                <div>Submit</div>
                {loading ? <LinearProgress /> : null}
            </RaisedButton>
        </CardActions>
    </Card>
);

Login.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    onOriginChange: PropTypes.func.isRequired,
    onProjectIdChange: PropTypes.func.isRequired,
    onSecretChange: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    origin: PropTypes.string,
    projectId: PropTypes.string,
    secret: PropTypes.string,
    submit: PropTypes.func.isRequired,
    token: PropTypes.string,
};

export default provideLoginState(
    injectState(({ state: { error, loading, origin, projectId, secret, token }, effects }) => (
        <Login
            error={error}
            loading={loading}
            onOriginChange={effects.onOriginChange}
            onProjectIdChange={effects.onProjectIdChange}
            onSecretChange={effects.onSecretChange}
            onTokenChange={effects.onTokenChange}
            origin={origin}
            projectId={projectId}
            secret={secret}
            submit={() => effects.submit({ origin, projectId, token, secret })}
            token={token}
        />
    )),
);
