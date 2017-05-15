import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';

export default class SidebarItem extends Component {
    handleClick = () => {
        this.props.onSelected(this.props.value);
    }
    render() {
        const { text } = this.props;
        return (
            <MenuItem
                primaryText={text}
                onTouchTap={this.handleClick}
            />
        );
    }
}

