import React from 'react';
import PropTypes from 'proptypes';
import JsonView from 'react-pretty-json';

const styles = {
    container: {
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
    },
}

const Environment = ({ environment: { name }, config }) => (
    <div style={styles.container}>
        <JsonView json={config} spaces={4} />
    </div>
);

Environment.propTypes = {
    config: PropTypes.object,
    environment: PropTypes.object,
};

export default Environment;
