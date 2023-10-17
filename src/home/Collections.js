import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// notification
import { useSnackbar } from 'notistack';

// api
import wrapper from '../api/wrapper';
import collectionApi from '../api/collection'

//mui 
import { experimentalStyled as styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Paper, Grid, Stack, Button } from '@mui/material';

// icons
import { IconUpload } from '@tabler/icons-react';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Collections = () => {

    const navigate = useNavigate()

    const createCollection = wrapper(collectionApi.createCollection);
    const getAllCollections = wrapper(collectionApi.getAllCollection);

    const [savedCollections, setSavedCollections] = useState([]);
    const [createdCollection, setCreatedCollection] = useState(undefined);

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        getAllCollections.request();
    },[])

    useEffect(() => {
        if (getAllCollections.data) {
            const retrievedCollections = getAllCollections.data
            console.log('Got saved collections: ', retrievedCollections);
            setSavedCollections(retrievedCollections)
        } else if (getAllCollections.error) {
            const error = getAllCollections.error
            if (!error.response) {
                enqueueSnackbar(`Failed to get saved collections: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to get saved collections: ${errorData}`, { variant: 'error'});
            }
        }
    },[getAllCollections.data, getAllCollections.error])

    const addCollection = (e) => {
        if (!e.target.files) return

        if (e.target.files.length === 1) {
            const file = e.target.files[0]
            createCollection.request(file)
        }
    }

    useEffect(() => {
        if (createCollection.data) {
            const createdCollection = createCollection.data
            console.log('Created collection: ', createdCollection);
            setCreatedCollection(createdCollection)
        } else if (createCollection.error) {
            const error = createCollection.error
            if (!error.response) {
                enqueueSnackbar(`Failed to create collection: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to create collection: ${errorData}`, { variant: 'error'});
            }
        }
    },[createCollection.data, createCollection.error])

    return (
        <>
            <Card>
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
                                <Item
                                    sx={{ "&:hover": { cursor: 'pointer' } }}
                                    // onClick={() => navigate(`/flow/${flowtest.id}`)}
                                >
                                    <Typography variant="h5" noWrap component="div">
                                        {collection.name}
                                    </Typography>
                                    {collection.id}
                                </Item>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}

export default Collections;