import React from 'react';
import PropTypes from 'proptypes';
import SidebarItem from './SidebarItem';

const styles = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    order: -1,
    flexBasis: 256,
    backgroundColor: 'rgb(232, 232, 232)',
    paddingTop: 16,
};

const Sidebar = ({ activeEnvironment, environments, onEnvironmentSelected }) => (
    <div style={styles}>
        {environments.map(environment => (
            <SidebarItem
                key={environment.name}
                active={activeEnvironment === environment.name}
                onSelected={onEnvironmentSelected}
                text={environment.name}
                value={environment.name}
            />
        ))}
    </div>
);

Sidebar.propTypes = {
    activeEnvironment: PropTypes.string,
    environments: PropTypes.arrayOf(PropTypes.object),
    onEnvironmentSelected: PropTypes.func,
};

Sidebar.defaultProps = {
    environments: [],
};

export default Sidebar;
