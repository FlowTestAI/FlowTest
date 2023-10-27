import * as React from 'react';
import { useState } from 'react';

// MUI
import {
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Stack, 
    Box, 
    OutlinedInput, 
    Typography
} from '@mui/material';

const AuthKeyDialog = ({ show, onCancel, onAddAuth }) => {

    const [name, setName] = useState('')
    const [accessId, setAccessId] = useState('')
    const [accessKey, setAccessKey] = useState('')

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Name</Typography>
                        </Stack>
                        <OutlinedInput
                            id='keyName'
                            type='string'
                            fullWidth
                            placeholder='Enter Name'
                            value={name}
                            name='keyName'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Access Id</Typography>
                        </Stack>
                        <OutlinedInput
                            id='keyName'
                            type='string'
                            fullWidth
                            placeholder='Enter Access Id'
                            value={accessId}
                            name='keyName'
                            onChange={(e) => setAccessId(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Access Key</Typography>
                        </Stack>
                        <OutlinedInput
                            id='keyName'
                            type='string'
                            fullWidth
                            placeholder='Enter Access Key'
                            value={accessKey}
                            name='keyName'
                            onChange={(e) => setAccessKey(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Stack flexDirection='row'>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant='contained' sx={{ color: 'white', mr: 1, height: 37, marginBottom: 1 }} onClick={() => onAddAuth(name, accessId, accessKey)}>
                            Create
                        </Button>
                    </Stack>
                </DialogActions>
            </>
      </Dialog>
    ) : null

    return component;
}

export default AuthKeyDialog