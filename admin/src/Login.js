import React from 'react';
import PropTypes from 'proptypes';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { injectState } from 'freactal';

import provideLoginState from './provideLoginState';
import Alert from './components/Alert';

export const LoginComponent = ({
    state: { error, loading, origin, projectId, passphrase, token },
    effects: { onOriginChange, onpassphraseChange, onTokenChange, onProjectIdChange },
    submit,
}) => (
    <Card>
        <CardTitle title="comfy admin" subtitle="enter your token and passphrase" />
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
                    name="passphrase"
                    value={passphrase}
                    floatingLabelText="passphrase"
                    fullWidth
                    onChange={onpassphraseChange}
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

LoginComponent.propTypes = {
    state: PropTypes.shape({
        error: PropTypes.string,
        loading: PropTypes.bool,
        origin: PropTypes.string,
        projectId: PropTypes.string,
        passphrase: PropTypes.string,
        token: PropTypes.string,
    }),
    effects: PropTypes.shape({
        onOriginChange: PropTypes.func.isRequired,
        onProjectIdChange: PropTypes.func.isRequired,
        onpassphraseChange: PropTypes.func.isRequired,
        onTokenChange: PropTypes.func.isRequired,
    }),
    submit: PropTypes.func.isRequired,
};

const enhance = compose(
    provideLoginState,
    injectState,
    withHandlers({
        submit: ({ state: { origin, projectId, token, passphrase }, effects: { submit } }) => () =>
            submit({ origin, projectId, token, passphrase }),
    }),
);
export default enhance(LoginComponent);
