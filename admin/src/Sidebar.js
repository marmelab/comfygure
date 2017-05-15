import React from 'react';
import PropTypes from 'proptypes';
import Paper from 'material-ui/Paper';
import SidebarItem from './SidebarItem';

const styles = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    order: -1,
};

const Sidebar = ({ environments, onEnvironmentSelected }) => (
    <Paper style={styles}>
        {environments.map(environment => (
            <SidebarItem
                onSelected={onEnvironmentSelected}
                text={environment.name}
                value={environment.name}
            />
        ))}
    </Paper>
);

Sidebar.propTypes = {
    environments: PropTypes.arrayOf(PropTypes.object),
    onEnvironmentSelected: PropTypes.func,
};

Sidebar.defaultProps = {
    environments: [],
}

export default Sidebar;
