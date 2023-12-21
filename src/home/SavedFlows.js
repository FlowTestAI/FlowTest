import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'

// notification
import { useSnackbar } from 'notistack';

// api
import wrapper from '../api/wrapper';
import flowTestApi from '../api/flowtest'

//mui 
import { experimentalStyled as styled } from '@mui/material/styles';
import { 
    Card, 
    CardContent, 
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton  
} from '@mui/material';

// icons
import { IconTrash } from '@tabler/icons-react';
import DeleteDialog from './DeleteDialog';

const SavedFlows = () => {

    const navigate = useNavigate()

    const [savedFlowTests, setSavedFlowTests] = useState([]);
    const getAllFlowTest = wrapper(flowTestApi.getAllFlowTest);
    const deleteFlowTest = wrapper(flowTestApi.deleteFlowTest);

    // notification
    const { enqueueSnackbar, _ } = useSnackbar();

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

    // Delete

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(undefined)

    const deleteFlowtest = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    }

    const handleDeleteFlowtest = () => {
        if (deleteId !== undefined) {
            deleteFlowTest.request(deleteId);
        }
        setDeleteId(undefined);
    }

    useEffect(() => {
        if (deleteFlowTest.data) {
            const deletedFlowtest = deleteFlowTest.data
            console.log('Deleted flowtest: ', deletedFlowtest);
            enqueueSnackbar('Deleted flowtest!', { variant: 'success' });
            getAllFlowTest.request();
        } else if (deleteFlowTest.error) {
            const error = deleteFlowTest.error
            if (!error.response) {
                enqueueSnackbar(`Failed to delete flowtest: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to delete flowtest: ${errorData}`, { variant: 'error'});
            }
        }
    },[deleteFlowTest.data, deleteFlowTest.error])

    return (
        <>
            <Card>
                <CardContent>
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
                                {savedFlowTests.map((flowtest, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell 
                                            component="th" 
                                            scope="row"
                                            sx={{ "&:hover": { cursor: 'pointer' } }}
                                            onClick={() => navigate(`/flow/${flowtest.id}`)}
                                        >
                                            {flowtest.name}
                                        </TableCell>
                                        <TableCell>{flowtest.createdDate}</TableCell>
                                        <TableCell>
                                            <IconButton title='Delete' color='error' onClick={() => deleteFlowtest(flowtest.id)}>
                                                <IconTrash />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <DeleteDialog open={openDelete} openDeleteDialog={setOpenDelete} handleDelete={handleDeleteFlowtest} dialogName='flowtest'/>
        </>
    );
}

export default SavedFlows;