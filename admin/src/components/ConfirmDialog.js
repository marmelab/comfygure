import React from 'react';
import PropTypes from 'proptypes';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export const ConfirmDialogComponent = ({ open, onCancel, onConfirm, text }) => (
    <Dialog
        actions={[
            <FlatButton label="Cancel" onTouchTap={onCancel} />,
            <FlatButton label="Confirm" primary keyboardFocused={true} onTouchTap={onConfirm} />,
        ]}
        open={open}
    >
        {text}
    </Dialog>
);

ConfirmDialogComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool,
    text: PropTypes.string.isRequired,
};

export default ConfirmDialogComponent;
