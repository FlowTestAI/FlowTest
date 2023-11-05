import * as React from 'react';

// mui
import { 
    Card, 
    CardContent,
    CardHeader,
    TextField,
    Button,
    Stack,
    CircularProgress
} from "@mui/material";

import { green } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';

// notification
import { useSnackbar } from 'notistack';

// api
import wrapper from '../api/wrapper';
import flowTestAIApi from '../api/flowtestai'

const FlowTestAI = () => {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();

    const buttonSx = {
        ...(success && {
        bgcolor: green[500],
        '&:hover': {
            bgcolor: green[700],
        },
        }),
    };

    // notification
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [flowCmd, setFlowCmd] = React.useState("")

    const createFlowTestAIApi = wrapper(flowTestAIApi.createFlowTestAI);

    React.useEffect(() => {
        if (createFlowTestAIApi.data) {
            const createdFlowTest = createFlowTestAIApi.data
            if (loading) {
                setSuccess(true);
                setLoading(false);
            }
            console.log(createdFlowTest);
        //   setFlowTest(createdFlowTest)
        //   setIsDirty(false)
        //   enqueueSnackbar('Saved FlowTest!', { variant: 'success' });
        //   window.history.replaceState(null, null, `/flow/${createdFlowTest.id}`)
        } else if (createFlowTestAIApi.error) {
            const error = createFlowTestAIApi.error
            if (!error.response) {
                enqueueSnackbar(`Failed to create flowtest: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to create flowtest: ${errorData}`, { variant: 'error'});
            }
        }
    },[createFlowTestAIApi.data, createFlowTestAIApi.error])

    return (
        <>
            <Card>
                <CardContent>
                    <Stack spacing={2} direction="column">
                        <TextField
                            fullWidth
                            id="outlined-multiline-static"
                            label="Enter your flow step by step!"
                            multiline
                            rows={4}
                            defaultValue=""
                            onChange={(e) => {
                                setFlowCmd(e.target.value);
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={buttonSx}
                            disabled={loading}
                            endIcon={<SendIcon />}
                            onClick={() => {
                                if (!flowCmd.trim()) {
                                    enqueueSnackbar('Please enter a vaid command', { variant: 'error'});
                                } else {
                                    if (!loading) {
                                        setSuccess(false);
                                        setLoading(true);
                                    }
                                    createFlowTestAIApi.request(flowCmd);
                                }
                            }}
                        >
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: green[500],
                                    }}
                                />
                            )}
                            Create Flow
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}

export default FlowTestAI;