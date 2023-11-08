import * as React from 'react';
import { useNavigate } from 'react-router-dom'

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
import collectionApi from '../api/collection'

const parseResponse = (outputNodes, savedNodes) => {
    let parsedNodes = [];
    outputNodes.map((outputNode, index) => {
        const savedNode = savedNodes.find((node, index) => node.operationId === outputNode.name);
        if (savedNode != undefined) {
            const node_arguments = JSON.parse(outputNode.arguments)
            if (node_arguments.requestBody) {
                savedNode["requestBody"] = {};
                savedNode["requestBody"]["type"] = "raw-json"
                savedNode["requestBody"]["body"] = JSON.stringify(node_arguments.requestBody);
            }
            if (node_arguments.parameters) {
                savedNode.variables = {}
                Object.entries(node_arguments.parameters).map(([paramName, paramValue], index) => {
                    savedNode.variables[paramName] = {
                        type: typeof(paramValue),
                        value: paramValue
                    }
                })
            }
            parsedNodes.push({
                ...savedNode,
                type: 'requestNode'
            })
        } else {
            throw {
                "status": "Failed",
                "error": `Could not find node: ${outputNode.name} in existing collections`
            };
        }
    })

    return {
        "status": "Success",
        "output": parsedNodes
    };
}

const FlowTestAI = () => {
    const navigate = useNavigate()    

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

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
    const getAllCollectionsApi = wrapper(collectionApi.getAllCollection)

    React.useEffect(() => {
        if (createFlowTestAIApi.data) {
            const outputNodes = createFlowTestAIApi.data
            if (loading) {
                setSuccess(true);
                setLoading(false);
            }
            console.log(outputNodes);
            try {
                const response = parseResponse(outputNodes, savedNodes)
                console.log(response)
                const initialNodes = {
                    initialNodes: response.output
                }
                navigate('/flow', {state: initialNodes})
            } catch (err) {
                enqueueSnackbar(`Failed to create flowtest: ${err}`, { variant: 'error'});
            }
        //   setFlowTest(createdFlowTest)
        //   setIsDirty(false)
        //   enqueueSnackbar('Saved FlowTest!', { variant: 'success' });
        //   window.history.replaceState(null, null, `/flow/${createdFlowTest.id}`)
        } else if (createFlowTestAIApi.error) {
            const error = createFlowTestAIApi.error
            if (loading) {
                setSuccess(false);
                setLoading(false);
            }
            if (!error.response) {
                enqueueSnackbar(`Failed to create flowtest: ${error}`, { variant: 'error'});
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar(`Failed to create flowtest: ${errorData}`, { variant: 'error'});
            }
        }
    },[createFlowTestAIApi.data, createFlowTestAIApi.error])

    // Get All collections
    const [savedCollections, setSavedCollections] = React.useState([]);
    const [savedNodes, setSavedNodes] = React.useState([]);

    React.useEffect(() => {
        if (getAllCollectionsApi.data) {
            const retrievedCollections = getAllCollectionsApi.data
            console.log('Got saved collections: ', retrievedCollections);
            setSavedCollections(retrievedCollections)
            let nodes = []
            retrievedCollections.map((collection, index) => {
                JSON.parse(collection.nodes).map((node, index1) => {
                    nodes.push(node);
                })
            })
            setSavedNodes(nodes);
        } else if (getAllCollectionsApi.error) {
            const error = getAllCollectionsApi.error
            if (!error.response) {
                console.log('Failed to get saved collections: ', error)
            } else {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                console.log('Failed to get saved collections: ', errorData)
            }
        }
    },[getAllCollectionsApi.data, getAllCollectionsApi.error])

    // Initialization
    React.useEffect(() => {
        getAllCollectionsApi.request();
    }, []);

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