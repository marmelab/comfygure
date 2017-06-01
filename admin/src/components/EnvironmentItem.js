import React, { Component } from 'react';
import PropTypes from 'proptypes';
import IconButton from 'material-ui/IconButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import LockClose from 'material-ui/svg-icons/action/lock-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

const styles = {
    tr: {
        cursor: 'pointer',
        height: 50,
    },
    trHover: {
        backgroundColor: 'rgb(232, 232, 232)',
        cursor: 'pointer',
        height: 50,
    },
    placeholder: {
        backgroundColor: 'rgb(208, 208, 208)',
        height: 16,
        width: '100%',
    },
    cell: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    buttonsCell: {
        textAlign: 'right',
        whiteSpace: 'no-wrap',
    },
};

export class EnvironmentItemComponent extends Component {
    state = {
        hover: false,
        showEncryted: false,
    };

    static propTypes = {
        name: PropTypes.string.isRequired,
        onEdit: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
    };

    toggleShowDecrypted = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showEncryted: !this.state.showEncryted });
    };

    handleEdit = () => {
        this.props.onEdit({ name: this.props.name, value: this.props.value });
    };

    handleRemove = () => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onRemove(this.props.name);
    };

    toggleHover = () => {
        this.setState({ hover: !this.state.hover });
    };

    render() {
        const { name, value } = this.props;
        const { hover, showEncryted } = this.state;

        const lockButton = (
            <IconButton
                tooltip={showEncryted ? 'Lock' : 'Unlock'}
                tooltipPosition="top-center"
                onClick={this.toggleShowDecrypted}
            >
                {showEncryted ? <LockOpen /> : <LockClose />}
            </IconButton>
        );

        const removeButton = (
            <IconButton tooltip="Delete" tooltipPosition="top-center" onClick={this.handleRemove}>
                <DeleteIcon />}
            </IconButton>
        );

        const editButton = (
            <IconButton tooltip="Edit" tooltipPosition="top-center" onClick={this.handleEdit}>
                <EditIcon />}
            </IconButton>
        );

        return (
            <tr
                style={hover ? styles.trHover : styles.tr}
                onClick={this.toggleShowDecrypted}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
            >
                <td style={styles.cell}>{name}</td>
                <td style={styles.cell}>
                    {showEncryted ? <span>{value}</span> : <div style={styles.placeholder} />}
                </td>
                <td style={styles.buttonsCell}>
                    {hover && <div>{editButton}{removeButton}{lockButton}</div>}
                </td>
            </tr>
        );
    }
}

export default EnvironmentItemComponent;
