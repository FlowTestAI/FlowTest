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

const DeleteDialog = ({open, openDeleteDialog, handleDelete, dialogName}) => {

    return (
        <div>
        <Dialog
            open={open}
            onClose={() => openDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Delete"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete {dialogName}?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => openDeleteDialog(false)}>Cancel</Button>
            <Button 
                onClick={() => {
                    handleDelete();
                    openDeleteDialog(false);
                }} variant="contained" autoFocus>
                Delete
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default DeleteDialog;
