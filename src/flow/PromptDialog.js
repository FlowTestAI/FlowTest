import * as React from 'react';
import { useNavigate } from 'react-router-dom'

// MUI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
 } from '@mui/material';

const PromptDialog = ({open, closePromptDialog}) => {

    const navigate = useNavigate()

    const handleNo = () => {
        closePromptDialog()
    }

    const handleYes = () => {
        closePromptDialog()
        window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate('/', { replace: true })
    }

    return (
        <div>
        <Dialog
            open={open}
            onClose={handleNo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Unsaved Changes"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You have unsaved changes. Are you sure you want to go back?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleNo}>No</Button>
            <Button onClick={handleYes} autoFocus variant="contained">
                Yes
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default PromptDialog;
