import React, { Component } from 'react';
import PropTypes from 'proptypes';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    button: {
        textAlign: 'left',
    },
    label: {
        textTransform: 'none',
    },
};

export default class SidebarItem extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        onSelected: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    };

    handleClick = () => {
        this.props.onSelected(this.props.value);
    };
    render() {
        const { active, text } = this.props;
        return (
            <FlatButton
                label={text}
                style={styles.button}
                labelStyle={styles.label}
                primary={active}
                onClick={this.handleClick}
            />
        );
    }
}
