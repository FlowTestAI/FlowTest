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
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@mui/material';

import { useSnackbar } from 'notistack';

// icons
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

const EnvDialog = ({ show, onCancel }) => {

    const [accessId, setAccessId] = useState('')
    const [accessKey, setAccessKey] = useState('')
    const [authKeys, setAuthKeys] = useState([])

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const addAuth = () => {
        setAuthKeys([accessId, accessKey]);
        enqueueSnackbar('Added Auth keys!', { variant: 'success' });
    }

    const editAuth = () => {
        enqueueSnackbar('Edited Auth keys!', { variant: 'success' });
    }

    const deleteAuth = () => {
        enqueueSnackbar('Deleted Auth keys!', { variant: 'success' });
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {authKeys.length <= 0 && (
                <>
                    <DialogContent>
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
                            <Button variant='contained' sx={{ color: 'white', mr: 1, height: 37, marginBottom: 1 }} onClick={addAuth} startIcon={<IconPlus />}>
                                Add Auth
                            </Button>
                        </Stack>
                    </DialogActions>
                </>
            )}

            {authKeys.length > 0 && (
                <>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Access Id</TableCell>
                                    <TableCell>Access Key</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={0} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component='th' scope='row' style={{ width: "30%" }}>
                                        {authKeys[0]}
                                    </TableCell>
                                    <TableCell component='th' scope='row'>
                                        {authKeys[1]}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <IconButton title='Edit' color='primary' onClick={() => editAuth()}>
                            <IconEdit />
                        </IconButton>
                        <IconButton title='Delete' color='error' onClick={() => deleteAuth()}>
                            <IconTrash />
                        </IconButton>
                    </div>
                </>
            )}
      </Dialog>
    ) : null

    return component;
}

export default EnvDialog