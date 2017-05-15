import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const styles = {
    environment: {
        paddingRight: 0,
    },
    tag: {
        lineHeight: '48px',
        fontSize: 20,
        fontFamily: 'Roboto, sans-serif',
        position: 'relative',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        color: 'rgba(0, 0, 0, 0.4)',
    },
    icon: {
        fill: 'rgba(0, 0, 0, 0.4)',
        marginTop: '-3px',
    },
};

class Tags extends Component {
    handleChange = (event, index, value) => {
        this.props.onTagSelected(value);
    }

    render() {
        const { environment, tag: currentTag, tags } = this.props;

        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text={environment.name} style={styles.environment} />
                    <ToolbarSeparator />
                    <DropDownMenu
                        value={currentTag.name}
                        onChange={this.handleChange}
                        labelStyle={styles.tag}
                        iconStyle={styles.icon}
                    >
                        {tags.map(tag => (
                            <MenuItem key={tag.name} value={tag.name} primaryText={tag.name} />
                        ))}
                    </DropDownMenu>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

Tags.propTypes = {
    environment: PropTypes.object,
    onTagSelected: PropTypes.func.isRequired,
    tag: PropTypes.object,
    tags: PropTypes.arrayOf(PropTypes.object),
}

export default Tags;
