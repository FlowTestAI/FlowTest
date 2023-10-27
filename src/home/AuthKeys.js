import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// api
import wrapper from '../api/wrapper';
import authKeyApi from '../api/authkey'

import { useSnackbar } from 'notistack';

//mui 
import { experimentalStyled as styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Paper, Grid, Stack, Button, IconButton } from '@mui/material';

// icons
import { IconPlus, IconTrash } from '@tabler/icons-react';
import DeleteCollectionDialog from './DeleteCollectionDialog';

import PropTypes from 'prop-types';
import AuthKeyDialog from './AuthKeyDialog';

const Item1 = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

    const [authKeyDialogOpen, setAuthKeyDialogOpen] = useState(false)
    const [authKeys, setAuthKeys] = useState([]);

    const createAuthKey = wrapper(authKeyApi.createNewAuthKey);
    const getAuthKeys = wrapper(authKeyApi.getAllAuthKeys);

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        getAuthKeys.request();
    }, [])

    useEffect(() => {
        if (getAuthKeys.data) {
            const retrievedAuthKeys = getAuthKeys.data
            console.log('Got saved auth keys: ', retrievedAuthKeys);
            setAuthKeys(retrievedAuthKeys)
        } else if (getAuthKeys.error) {
            const error = getAuthKeys.error
            if (!error.response) {
                enqueueSnackbar(`Failed to get saved authkeys: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to get saved authkeys: ${errorData}`, { variant: 'error'});
            }
        }
    },[getAuthKeys.data, getAuthKeys.error])

    useEffect(() => {
        if (createAuthKey.data) {
          const createdAuthKey = createAuthKey.data
          enqueueSnackbar('Added Auth key!', { variant: 'success' });
          getAuthKeys.request();
        } else if (createAuthKey.error) {
          const error = createAuthKey.error
          if (!error.response) {
            enqueueSnackbar(`Failed to add auth key: ${error}`, { variant: 'error'});
          } else {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar(`Failed to add auth key: ${errorData}`, { variant: 'error'});
          }
        }
    },[createAuthKey.data, createAuthKey.error])

    const addAuth = (name, accessId, accessKey) => {
        const newAuthKey = {
            name,
            accessId,
            accessKey
        }
        createAuthKey.request(newAuthKey);
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
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {authKeys.map((authkey, index) => (
                            <></>
                        ))}
                        {/* <DeleteCollectionDialog open={openDelete} openDeleteDialog={setOpenDelete} handleDelete={handleDeleteCollection}/> */}
                    </Grid>
                </CardContent>
            </Card>
            <AuthKeyDialog show={authKeyDialogOpen} onCancel={() => setAuthKeyDialogOpen(false)} onAddAuth={addAuth}/>
        </>
    );
}

export default AuthKeys;