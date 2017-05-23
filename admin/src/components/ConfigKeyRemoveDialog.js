import React from 'react';
import PropTypes from 'proptypes';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { injectState } from 'freactal';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export const ConfigKeyRemoveDialogComponent = ({
    state: { keyToRemove },
    effects: { cancelRemoveKey },
    removeConfigKey,
}) => (
    <Dialog
        actions={[
            <FlatButton label="Cancel" onTouchTap={cancelRemoveKey} />,
            <FlatButton label="Confirm" primary keyboardFocused={true} onTouchTap={removeConfigKey} />,
        ]}
        open={!!keyToRemove}
    >
        Do you really want to remove key <b>{keyToRemove}</b> ?
    </Dialog>
);

ConfigKeyRemoveDialogComponent.propTypes = {
    effects: PropTypes.shape({
        cancelRemoveKey: PropTypes.func.isRequired,
    }),
    removeConfigKey: PropTypes.func.isRequired,
    state: PropTypes.shape({
        keyToRemove: PropTypes.string,
    }),
};

export default compose(
    injectState,
    withHandlers({
        removeConfigKey: ({
            state: { config, environmentName, keyToRemove, origin, projectId, passphrase, token },
            effects: { removeConfigKey },
        }) => () =>
            removeConfigKey({ config, environmentName, key: keyToRemove, origin, projectId, passphrase, token }),
    }),
)(ConfigKeyRemoveDialogComponent);
