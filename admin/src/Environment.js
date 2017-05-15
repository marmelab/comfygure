import React from 'react';
import PropTypes from 'proptypes';

const styles = {
    container: {
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
    },
}
const Environment = ({ environment }) => (
    <div style={styles.container}>
        <h1>{environment.name}</h1>
    </div>
);

Environment.propTypes = {
    environment: PropTypes.object,
};

export default Environment;
