import React from 'react';
import PropTypes from 'proptypes';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { injectState } from 'freactal';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export const ConfigKeyEditionDialogComponent = ({
    state: { keyToEdit },
    effects: { cancelEditKey },
    updateConfigKey,
    updateName,
    updateValue,
}) => (
    <Dialog
        actions={[
            <FlatButton label="Cancel" onTouchTap={cancelEditKey} />,
            <FlatButton label="Save" primary onTouchTap={updateConfigKey} />,
        ]}
        open={!!keyToEdit}
    >
        <TextField floatingLabelText="Key" fullWidth value={keyToEdit && keyToEdit.name} onChange={updateName} />
        <TextField floatingLabelText="Value" fullWidth value={keyToEdit && keyToEdit.value} onChange={updateValue} />
    </Dialog>
);

ConfigKeyEditionDialogComponent.propTypes = {
    state: PropTypes.shape({
        keyToEdit: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
        }),
    }),
    effects: PropTypes.shape({
        cancelEditKey: PropTypes.func.isRequired,
        updateEditedKey: PropTypes.func.isRequired,
    }),
    updateConfigKey: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
};

export default compose(
    injectState,
    withHandlers({
        updateConfigKey: ({
            state: { config, environmentName, keyToEdit, origin, projectId, passphrase, token },
            effects: { updateConfigKey },
        }) => () => updateConfigKey({ config, environmentName, key: keyToEdit, origin, projectId, passphrase, token }),
        updateName: ({ state: { keyToEdit: { value } }, effects: { updateEditedKey } }) => (event, name) =>
            updateEditedKey({ name, value }),
        updateValue: ({ state: { keyToEdit: { name } }, effects: { updateEditedKey } }) => (event, value) =>
            updateEditedKey({ name, value }),
    }),
)(ConfigKeyEditionDialogComponent);
