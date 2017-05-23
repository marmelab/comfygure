import React, { Component } from 'react';
import PropTypes from 'proptypes';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { injectState } from 'freactal';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export class ConfigKeyEditionDialogComponent extends Component {
    static propTypes = {
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
    };

    handleNameChange = (event, name) => {
        this.props.effects.updateEditedKey({ name, value: this.props.state.keyToEdit.value });
    };

    handleValueChange = (event, value) => {
        this.props.effects.updateEditedKey({ name: this.props.state.keyToEdit.name, value });
    };

    render() {
        const { state: { keyToEdit }, effects: { cancelEditKey }, updateConfigKey } = this.props;

        return (
            <Dialog
                actions={[
                    <FlatButton label="Cancel" onTouchTap={cancelEditKey} />,
                    <FlatButton label="Save" primary keyboardFocused={true} onTouchTap={updateConfigKey} />,
                ]}
                open={!!keyToEdit}
            >
                <TextField
                    floatingLabelText="Key"
                    fullWidth
                    value={keyToEdit && keyToEdit.name}
                    onChange={this.handleNameChange}
                />
                <TextField
                    floatingLabelText="Value"
                    fullWidth
                    value={keyToEdit && keyToEdit.value}
                    onChange={this.handleValueChange}
                />
            </Dialog>
        );
    }
}

export default compose(
    injectState,
    withHandlers({
        updateConfigKey: ({
            state: { config, environmentName, keyToEdit, origin, projectId, passphrase, token },
            effects: { updateConfigKey },
        }) => () => updateConfigKey({ config, environmentName, key: keyToEdit, origin, projectId, passphrase, token }),
    }),
)(ConfigKeyEditionDialogComponent);
