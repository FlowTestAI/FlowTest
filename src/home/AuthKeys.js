import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// api
import wrapper from '../api/wrapper';
import authKeyApi from '../api/authkey'

import { useSnackbar } from 'notistack';

//mui 
import { experimentalStyled as styled } from '@mui/material/styles';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Paper, 
    Grid, 
    Stack, 
    Button, 
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

// icons
import { IconPlus, IconTrash } from '@tabler/icons-react';
import DeleteDialog from './DeleteDialog';

import PropTypes from 'prop-types';
import AuthKeyDialog from './AuthKeyDialog';

function Item(props) {
    const { sx, ...other } = props;
    return (
        <Box
        sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
            border: '1px solid',
            borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            ...sx,
        }}
        {...other}
        />
    );
}
  
Item.propTypes = {
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
        ),
        PropTypes.func,
        PropTypes.object,
    ]),
};

const AuthKeys = () => {

    const createAuthKeyApi = wrapper(authKeyApi.createNewAuthKey);
    const getAuthKeysApi = wrapper(authKeyApi.getAllAuthKeys);
    const deleteAuthKeyApi = wrapper(authKeyApi.deleteAuthKey);

    const [authKeyDialogOpen, setAuthKeyDialogOpen] = useState(false)
    const [authKeys, setAuthKeys] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(undefined)

    const deleteAuthKey = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    }

    const handleDeleteAuthKey = () => {
        if (deleteId != undefined) {
            deleteAuthKeyApi.request(deleteId);
        }
        setDeleteId(undefined);
    }

    useEffect(() => {
        if (deleteAuthKeyApi.data) {
            const deletedAuthKey = deleteAuthKeyApi.data
            console.log('Deleted authkey: ', deletedAuthKey);
            enqueueSnackbar('Deleted Auth key!', { variant: 'success' });
            getAuthKeysApi.request();
        } else if (deleteAuthKeyApi.error) {
            const error = deleteAuthKeyApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to delete authkey: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to delete authkey: ${errorData}`, { variant: 'error'});
            }
        }
    },[deleteAuthKeyApi.data, deleteAuthKeyApi.error])

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        getAuthKeysApi.request();
    }, [])

    useEffect(() => {
        if (getAuthKeysApi.data) {
            const retrievedAuthKeys = getAuthKeysApi.data
            console.log('Got saved auth keys: ', retrievedAuthKeys);
            setAuthKeys(retrievedAuthKeys)
        } else if (getAuthKeysApi.error) {
            const error = getAuthKeysApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to get saved authkeys: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to get saved authkeys: ${errorData}`, { variant: 'error'});
            }
        }
    },[getAuthKeysApi.data, getAuthKeysApi.error])

    useEffect(() => {
        if (createAuthKeyApi.data) {
          const createdAuthKey = createAuthKeyApi.data
          enqueueSnackbar('Added Auth key!', { variant: 'success' });
          getAuthKeysApi.request();
        } else if (createAuthKeyApi.error) {
          const error = createAuthKeyApi.error
          if (!error.response) {
            enqueueSnackbar(`Failed to add auth key: ${error}`, { variant: 'error'});
          } else {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar(`Failed to add auth key: ${errorData}`, { variant: 'error'});
          }
        }
    },[createAuthKeyApi.data, createAuthKeyApi.error])

    const addAuth = (name, accessId, accessKey) => {
        const newAuthKey = {
            name,
            accessId,
            accessKey
        }
        createAuthKeyApi.request(newAuthKey);
        setAuthKeyDialogOpen(false);
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack flexDirection='row'>
                        {/* <h1>Collections</h1> */}
                        <Grid sx={{ mb: 1.25 }} container direction='row'>
                            <Box sx={{ flexGrow: 1 }} />
                            <Grid item>
                                <Button 
                                    variant='contained' 
                                    component='label' 
                                    sx={{ color: 'white' }} 
                                    startIcon={<IconPlus />} 
                                    onClick={() => setAuthKeyDialogOpen(true)}
                                >
                                    {'Add'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                    {authKeys.length > 0 && (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Access Id</TableCell>
                                        <TableCell>Access Key</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {authKeys.map((authkey, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {authkey.name}
                                            </TableCell>
                                            <TableCell>{authkey.accessId}</TableCell>
                                            <TableCell>
                                                {`${authkey.accessKey.substring(0, 2)}${'•'.repeat(18)}${authkey.accessKey.substring(
                                                    authkey.accessKey.length - 5
                                                )}`}
                                            </TableCell>
                                            <TableCell>{authkey.createdDate}</TableCell>
                                            <TableCell>
                                                <IconButton title='Delete' color='error' onClick={() => deleteAuthKey(authkey.id)}>
                                                    <IconTrash />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
            <AuthKeyDialog show={authKeyDialogOpen} onCancel={() => setAuthKeyDialogOpen(false)} onAddAuth={addAuth}/>
            <DeleteDialog open={openDelete} openDeleteDialog={setOpenDelete} handleDelete={handleDeleteAuthKey} dialogName='authkey'/>
        </>
    );
}

export default AuthKeys;