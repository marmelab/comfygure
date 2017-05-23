import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import LockClose from 'material-ui/svg-icons/action/lock-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        marginRight: '3rem',
    },
    placeholder: {
        backgroundColor: 'rgb(208, 208, 208)',
        height: 16,
        flexGrow: 2,
        marginLeft: '3rem',
    },
};

export class EnvironmentItemComponent extends Component {
    state = {
        hover: false,
        showEncryted: false,
    };

    static propTypes = {
        name: PropTypes.string.isRequired,
        onRemove: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
    };

    toggleShowDecrypted = () => {
        this.setState({ showEncryted: !this.state.showEncryted });
    };

    handleRemove = () => {
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

        return (
            <ListItem
                onClick={this.toggleShowDecrypted}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                primaryText={
                    <div style={styles.container}>
                        <span>{name}</span>
                        {showEncryted ? <span>{value}</span> : <div style={styles.placeholder} />}
                    </div>
                }
                rightIconButton={hover ? <div>{removeButton}{lockButton}</div> : lockButton}
            />
        );
    }
}

export default EnvironmentItemComponent;
