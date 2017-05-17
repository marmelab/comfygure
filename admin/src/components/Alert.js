import React from 'react';
import proptypes from 'proptypes';
import { red400 } from 'material-ui/styles/colors';

const styles = {
    alert: {
        display: 'inline-block',
        color: red400,
    },
};

export const AlertComponent = ({ message }) => {
    if (!message) {
        return null;
    }
    return <div style={styles.alert}>{message}</div>;
};

AlertComponent.defaultProps = {
    message: null,
};

AlertComponent.propTypes = {
    message: proptypes.string,
};

export default AlertComponent;
