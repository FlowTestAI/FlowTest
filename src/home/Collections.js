import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// notification
import { useSnackbar } from 'notistack';

// api
import wrapper from '../api/wrapper';
import collectionApi from '../api/collection'

//mui 
import { experimentalStyled as styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Paper, Grid, Stack, Button, IconButton } from '@mui/material';

// icons
import { IconUpload, IconTrash } from '@tabler/icons-react';
import DeleteDialog from './DeleteDialog';

import PropTypes from 'prop-types';

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

const Collections = () => {

    const navigate = useNavigate()

    const URLpath = document.location.pathname.toString().split('/')
    const collectionId = URLpath[URLpath.length - 1] === 'collection' ? undefined : URLpath[URLpath.length - 1]

    const createCollectionApi = wrapper(collectionApi.createCollection);
    const getAllCollectionsApi = wrapper(collectionApi.getAllCollection);
    const deleteCollectionApi = wrapper(collectionApi.deleteCollection);
    const getCollectionApi = wrapper(collectionApi.getCollection);

    const [savedCollections, setSavedCollections] = useState([]);
    const [createdCollection, setCreatedCollection] = useState(undefined);
    const [retrievedCollection, setRetrievedCollection] = useState(undefined);

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // Initialization

    useEffect(() => {
        if (collectionId != undefined) {
            getCollectionApi.request(collectionId);
        } else {
            getAllCollectionsApi.request();
        }
    }, [collectionId])

    // Get All
    useEffect(() => {
        if (getAllCollectionsApi.data) {
            const retrievedCollections = getAllCollectionsApi.data
            console.log('Got saved collections: ', retrievedCollections);
            setSavedCollections(retrievedCollections)
        } else if (getAllCollectionsApi.error) {
            const error = getAllCollectionsApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to get saved collections: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to get saved collections: ${errorData}`, { variant: 'error'});
            }
        }
    },[getAllCollectionsApi.data, getAllCollectionsApi.error])

    // Get Specific
    useEffect(() => {
        if (getCollectionApi.data) {
            const retrievedCollection = getCollectionApi.data
            console.log('Got collection: ', retrievedCollection);
            setRetrievedCollection(retrievedCollection)
        } else if (getCollectionApi.error) {
            const error = getCollectionApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to get collection: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to get collection: ${errorData}`, { variant: 'error'});
            }
        }
    },[getCollectionApi.data, getCollectionApi.error])

    // Create

    const addCollection = (e) => {
        if (!e.target.files) return

        if (e.target.files.length === 1) {
            const file = e.target.files[0]
            createCollectionApi.request(file)
        }
    }

    useEffect(() => {
        if (createCollectionApi.data) {
            const createdCollection = createCollectionApi.data
            console.log('Created collection: ', createdCollection);
            setCreatedCollection(createdCollection)
            enqueueSnackbar('Created collection!', { variant: 'success' });
            getAllCollectionsApi.request();
        } else if (createCollectionApi.error) {
            const error = createCollectionApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to create collection: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to create collection: ${errorData}`, { variant: 'error'});
            }
        }
    },[createCollectionApi.data, createCollectionApi.error])

    // Delete

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(undefined)

    const deleteCollection = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    }

    const handleDeleteCollection = () => {
        if (deleteId != undefined) {
            deleteCollectionApi.request(deleteId);
        }
        setDeleteId(undefined);
    }

    useEffect(() => {
        if (deleteCollectionApi.data) {
            const deletedCollection = deleteCollectionApi.data
            console.log('Deleted collection: ', deletedCollection);
            enqueueSnackbar('Deleted collection!', { variant: 'success' });
            getAllCollectionsApi.request();
        } else if (deleteCollectionApi.error) {
            const error = deleteCollectionApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to delete collection: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to delete collection: ${errorData}`, { variant: 'error'});
            }
        }
    },[deleteCollectionApi.data, deleteCollectionApi.error])

    return (
        <>
            <Card>
                {collectionId == undefined ?
                    (
                        <CardContent>
                            <Stack flexDirection='row'>
                                {/* <h1>Collections</h1> */}
                                <Grid sx={{ mb: 1.25 }} container direction='row'>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Grid item>
                                        <Button variant='contained' component='label' sx={{ color: 'white' }} startIcon={<IconUpload />}>
                                            {'Import'}
                                            <input type='file' name='file' accept=".yaml,.yml" hidden onChange={(e) => addCollection(e)} />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Stack>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                {savedCollections.map((collection, index) => (
                                    <Grid item xs={2} sm={4} md={4} key={index}>
                                        <Item1
                                            sx={{ "&:hover": { cursor: 'pointer' } }}
                                            onClick={() => navigate(`/collection/${collection.id}`)}
                                        >
                                            <Typography variant="h6" noWrap component="div">
                                                {collection.name}
                                            </Typography>
                                            {collection.id}
                                        </Item1>
                                        <IconButton title='Delete' color='error' onClick={() => deleteCollection(collection.id)}>
                                            <IconTrash />
                                        </IconButton>
                                    </Grid>
                                ))}
                                <DeleteDialog open={openDelete} openDeleteDialog={setOpenDelete} handleDelete={handleDeleteCollection} dialogName='collection'/>
                            </Grid>
                        </CardContent>
                    ):
                    (
                        <CardContent>
                            {collectionId != undefined && retrievedCollection != undefined && (
                                <div style={{ width: '100%' }}>
                                    <Box
                                        sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
                                    >
                                        <Item sx={{ flexGrow: 1 }}>
                                            <div>
                                                <pre>{retrievedCollection.collection}</pre>
                                            </div>
                                        </Item>
                                        <Item sx={{ flexGrow: 1 }}>
                                            <div>
                                                <pre>{retrievedCollection.nodes}</pre>
                                            </div>
                                        </Item>
                                    </Box>
                                </div>
                            )}
                        </CardContent>
                    )}
            </Card>
        </>
    );
}

export default Collections;