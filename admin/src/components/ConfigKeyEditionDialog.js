import React, { Component } from 'react';
import PropTypes from 'proptypes';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export class ConfigKeyEditionDialogComponent extends Component {
    static propTypes = {
        configKey: PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
        onCancel: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        open: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentName: props.configKey ? props.configKey.name : undefined,
            currentValue: props.configKey ? props.configKey.value : undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.configKey) {
            this.setState({
                currentName: nextProps.configKey.name,
                currentValue: nextProps.configKey.value,
            });
        }
    }

    handleNameChange = (event, name) => {
        this.setState({ currentName: name });
    };

    handleValueChange = (event, value) => {
        this.setState({ currentValue: value });
    };

    handleSave = () => {
        this.props.onSave({ name: this.state.currentName, value: this.state.currentValue });
    };

    render() {
        const { open, onCancel } = this.props;
        const { currentName, currentValue } = this.state;
        return (
            <Dialog
                actions={[
                    <FlatButton label="Cancel" onTouchTap={onCancel} />,
                    <FlatButton label="Save" primary keyboardFocused={true} onTouchTap={this.handleSave} />,
                ]}
                open={open}
            >
                <TextField floatingLabelText="Key" fullWidth value={currentName} onChange={this.handleNameChange} />
                <TextField floatingLabelText="Value" fullWidth value={currentValue} onChange={this.handleValueChange} />
            </Dialog>
        );
    }
}

export default ConfigKeyEditionDialogComponent;
