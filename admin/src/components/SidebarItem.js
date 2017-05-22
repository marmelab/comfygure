import React, { Component } from 'react';
import PropTypes from 'proptypes';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    active: {
        fontWeight: 'bold',
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
            <MenuItem
                style={active ? styles.active : styles.default}
                primaryText={text}
                onTouchTap={this.handleClick}
            />
        );
    }
}
