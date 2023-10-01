import * as React from 'react';
import { useState, useEffect } from 'react';

// MUI
import {
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent,
    OutlinedInput,
    DialogTitle
} from '@mui/material';

const SaveDialog = ({show, onCancel, onConfirm}) => {

    const [flowTestName, setFlowTestName] = useState('')
    const [isReadyToSave, setIsReadyToSave] = useState(false)

    useEffect(() => {
        if (flowTestName) setIsReadyToSave(true)
        else setIsReadyToSave(false)
    }, [flowTestName])

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth='xs'
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                Save New FlowTest
            </DialogTitle>
            <DialogContent>
                <OutlinedInput
                    sx={{ mt: 1 }}
                    id='flowtest-name'
                    type='text'
                    fullWidth
                    placeholder='My New FlowTest'
                    value={flowTestName}
                    onChange={(e) => setFlowTestName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button disabled={!isReadyToSave} variant='contained' onClick={() => onConfirm(flowTestName)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    ) : null

    return component;
}

export default SaveDialog;