import React, { Component } from 'react';
import PropTypes from 'proptypes';
import MenuItem from 'material-ui/MenuItem';

export default class SidebarItem extends Component {
    static propTypes = {
        onSelected: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    };

    handleClick = () => {
        this.props.onSelected(this.props.value);
    };
    render() {
        const { text } = this.props;
        return <MenuItem primaryText={text} onTouchTap={this.handleClick} />;
    }
}
