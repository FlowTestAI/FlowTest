import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// notification
import { useSnackbar } from 'notistack';

// api
import wrapper from '../api/wrapper';
import collectionApi from '../api/collection'

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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow 
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// icons
import { IconUpload, IconTrash } from '@tabler/icons-react';
import DeleteDialog from './DeleteDialog';

import PropTypes from 'prop-types';
import CollectionTree from '../file-manager/CollectionTree';

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

    const URLpath = document.location.pathname.toString().split('/')
    const collectionId = URLpath[URLpath.length - 1] === 'collection' ? undefined : URLpath[URLpath.length - 1]

    const createCollectionApi = wrapper(collectionApi.createCollection);
    const getAllCollectionsApi = wrapper(collectionApi.getAllCollection);
    const deleteCollectionApi = wrapper(collectionApi.deleteCollection);
    const getCollectionApi = wrapper(collectionApi.getCollection);

    const [savedCollections, setSavedCollections] = useState([]);
    const [retrievedCollection, setRetrievedCollection] = useState(undefined);

    const [savedTreeNodes, setSavedTreeNodes] = useState([]);
    const [savedTrees, setSavedTrees] = useState([]);

    // notification
    const { enqueueSnackbar, _ } = useSnackbar();

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
            console.debug('Got saved collections: ', retrievedCollections);
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
            console.debug('Got collection: ', retrievedCollection);
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
            console.debug('Created collection: ', createdCollection.metadata);
            console.debug('Created tree node: ', createdCollection.node);
            setSavedTreeNodes([...savedTreeNodes, createdCollection.node]);
            const collectionTree = new CollectionTree(createdCollection.node, createdCollection.metadata.id)
            setSavedTrees([...savedTrees, collectionTree])
            console.log('Created collection tree: ', collectionTree)
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
        if (deleteId !== undefined) {
            deleteCollectionApi.request(deleteId);
        }
        setDeleteId(undefined);
    }

    useEffect(() => {
        if (deleteCollectionApi.data) {
            const deletedCollection = deleteCollectionApi.data
            console.debug('Deleted collection: ', deletedCollection);
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
                {collectionId === undefined ?
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
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell> </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {savedCollections.map((collection, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {collection.name}
                                                    {/* <Item1
                                                        sx={{ "&:hover": { cursor: 'pointer' } }}
                                                        onClick={() => navigate(`/collection/${collection.id}`)}
                                                    >
                                                        <Typography variant="h6" noWrap component="div">
                                                            {collection.name}
                                                        </Typography>
                                                        {collection.id}
                                                    </Item1> */}
                                                </TableCell>
                                                <TableCell>{collection.createdDate}</TableCell>
                                                <TableCell>
                                                    <IconButton title='Delete' color='error' onClick={() => deleteCollection(collection.id)}>
                                                        <IconTrash />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <DeleteDialog open={openDelete} openDeleteDialog={setOpenDelete} handleDelete={handleDeleteCollection} dialogName='collection'/>
                        </CardContent>
                    ):
                    (
                        <CardContent>
                            {collectionId !== undefined && retrievedCollection !== undefined && (
                                <div>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>OpenApi Spec</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <pre>{retrievedCollection.collection}</pre>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                        <Typography>Parsed Nodes</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <pre>{retrievedCollection.nodes}</pre>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            )}
                        </CardContent>
                    )}
            </Card>
        </>
    );
}

export default Collections;