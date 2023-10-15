import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// notification
import { useSnackbar } from 'notistack';

// api
import wrapper from '../api/wrapper';
import flowTestApi from '../api/flowtest'

//mui 
import { experimentalStyled as styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Paper, Grid } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const SavedFlows = () => {

    const navigate = useNavigate()

    const [savedFlowTests, setSavedFlowTests] = useState([]);
    const getAllFlowTest = wrapper(flowTestApi.getAllFlowTest);

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        getAllFlowTest.request();
    },[])

    useEffect(() => {
        if (getAllFlowTest.data) {
            const retrievedFlowtests = getAllFlowTest.data
            console.log('Got saved flowtests: ', retrievedFlowtests);
            setSavedFlowTests(retrievedFlowtests)
        } else if (getAllFlowTest.error) {
            const error = getAllFlowTest.error
            if (!error.response) {
            enqueueSnackbar(`Failed to get saved flowtests: ${error}`, { variant: 'error'});
            } else {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar(`Failed to get saved flowtests: ${errorData}`, { variant: 'error'});
            }
        }
    },[getAllFlowTest.data, getAllFlowTest.error])

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {savedFlowTests.map((flowtest, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <Item
                                    sx={{ "&:hover": { cursor: 'pointer' } }}
                                    onClick={() => navigate(`/flow/${flowtest.id}`)}
                                >
                                    <Typography variant="h5" noWrap component="div">
                                        {flowtest.name}
                                    </Typography>
                                    {flowtest.id}
                                </Item>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}

export default SavedFlows;