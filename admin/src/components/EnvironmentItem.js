import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import LockClose from 'material-ui/svg-icons/action/lock-outline';

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
        showEncryted: false,
    };

    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    };

    handleToggleShowDecrypted = () => {
        this.setState({ showEncryted: !this.state.showEncryted });
    };

    render() {
        const { name, value } = this.props;
        const { showEncryted } = this.state;

        return (
            <ListItem
                onClick={this.handleToggleShowDecrypted}
                primaryText={
                    <div style={styles.container}>
                        <span>{name}</span>
                        {showEncryted ? <span>{value}</span> : <div style={styles.placeholder} />}
                    </div>
                }
                rightIconButton={
                    <IconButton touch={true} onClick={this.handleToggleShowDecrypted}>
                        {showEncryted ? <LockOpen /> : <LockClose />}
                    </IconButton>
                }
            />
        );
    }
}

export default EnvironmentItemComponent;
