import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

// react flow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background, ControlButton } from 'reactflow';
import { Handle, Position } from "reactflow"
import 'reactflow/dist/style.css'

// css
import './index.css'

// MUI
import { 
  AppBar, 
  Box, 
  Toolbar,  
  Typography, 
  ButtonBase, 
  Avatar,
  Drawer,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

import ImportExportIcon from '@mui/icons-material/ImportExport';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// notification
import { useSnackbar } from 'notistack';

// API
import flowTestApi from '../api/flowtest'

// icons
import { IconDeviceFloppy, IconChevronLeft, IconFiles } from '@tabler/icons-react';

import RequestNode from './nodes/RequestNode';
import SelectAuthComponent from './SelectAuthComponent';
import CustomEdge from './edges/ButtonEdge';

// theme
import theme from './theme';

import AddNodes from './AddNodes';
import SaveDialog from './SaveDialog';
import wrapper from '../api/wrapper';
import PromptDialog from './PromptDialog';
import Graph from './graph/Graph';
import OutputNode from './nodes/OutputNode';
import EvaluateNode from './nodes/EvaluateNode';
import DelayNode from './nodes/DelayNode';

const StartNode = () => (
  <div style={{width: '150px', borderRadius: '5px', padding: '10px', color: '#555', border:'2px solid #ddd', textAlign:'center', fontSize:'20px', background:'#fff', fontWeight:'bold'}}>
    <div>Start</div>
    <Handle style={{}} type="source" position={Position.Right} />
  </div>
);

const Flow = () => {
  const location = useLocation();

  const navigate = useNavigate()

  const createNewFlowTest = wrapper(flowTestApi.createNewFlowTest)
  const updateFlowTest = wrapper(flowTestApi.updateFlowTest)
  const getFlowTest = wrapper(flowTestApi.getSpecificFlowTest)

  // notification
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [promptDialogOpen, setPromptDialogOpen] = useState(false)
  const [flowTest, setFlowTest]= useState({})

  const URLpath = document.location.pathname.toString().split('/')
  const flowTestId = URLpath[URLpath.length - 1] === 'flow' ? '' : URLpath[URLpath.length - 1]

  const [isDirty, setIsDirty] = useState(false)
  
  const nodeTypes = useMemo(() => (
  {
    startNode: StartNode, 
    requestNode: RequestNode,
    outputNode: OutputNode,
    evaluateNode: EvaluateNode,
    delayNode: DelayNode
  }), []);
  
  const edgeTypes = useMemo(() => (
  {
    buttonedge: CustomEdge,
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      type: 'buttonedge'
    }
    setEdges((eds) => addEdge(newEdge, eds))
  };

  const runnableEdges = (runnable) => {
    const updatedEdges = reactFlowInstance.getEdges().map((edge) => {
      return {
        ...edge,
        animated: runnable
      };
    })
    setEdges(updatedEdges)
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const getId = () => {
    const currentIds = reactFlowInstance.getNodes().map((node) => Number(node.id));
    const currentMaxId = Math.max(...currentIds);
    return `${currentMaxId + 1}`;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      let nodeData = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof nodeData === 'undefined' || !nodeData) {
        return;
      }

      nodeData = JSON.parse(nodeData)

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: nodeData.type,
        position,
        data: nodeData
      };
      console.debug('Dropped node: ', newNode);

      setNodes((nds) => nds.concat(newNode));
      setIsDirty(true);
    },
    [reactFlowInstance]
  );

  const getAllNodes = () => {
    reactFlowInstance.getNodes().map((node) => console.log(node))
    reactFlowInstance.getEdges().map((edge) => console.log(edge))
  }

  // SAVE

  const handleSaveFlow = (flowTestName) => {
      if (reactFlowInstance) {
        // save might get triggered when the flow is running, don't store animated edges
        const updatedEdges = reactFlowInstance.getEdges().map((edge) => {
          return {
            ...edge,
            animated: false
          };
        })
        const rfInstanceObject = reactFlowInstance.toObject()
        rfInstanceObject.edges = updatedEdges;
        // rfInstanceObject.nodes = nodes
        const flowData = JSON.stringify(rfInstanceObject)

        console.debug('Save flow: ', flowData)

        if (!flowTest.id) {
            const newFlowTestBody = {
                name: flowTestName,
                flowData
            }
            createNewFlowTest.request(newFlowTestBody)
        } else {
            const updateBody = {
                name: flowTestName,
                flowData
            }
            updateFlowTest.request(flowTest.id, updateBody)
        }
      }
  }

  useEffect(() => {
    if (createNewFlowTest.data) {
      const createdFlowTest = createNewFlowTest.data
      setFlowTest(createdFlowTest)
      setIsDirty(false)
      enqueueSnackbar('Saved FlowTest!', { variant: 'success' });
      window.history.replaceState(null, null, `/flow/${createdFlowTest.id}`)
    } else if (createNewFlowTest.error) {
      const error = createNewFlowTest.error
      if (!error.response) {
        enqueueSnackbar(`Failed to save flowtest: ${error}`, { variant: 'error'});
      } else {
        const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
        enqueueSnackbar(`Failed to save flowtest: ${errorData}`, { variant: 'error'});
      }
    }
  },[createNewFlowTest.data, createNewFlowTest.error])

  useEffect(() => {
    if (updateFlowTest.data) {
      const updatedFlowTest = updateFlowTest.data
      setFlowTest(updatedFlowTest)
      setIsDirty(false)
      enqueueSnackbar('Saved FlowTest!', { variant: 'success' });
    } else if (updateFlowTest.error) {
      const error = updateFlowTest.error
      if (!error.response) {
        enqueueSnackbar(`Failed to save flowtest: ${error}`, { variant: 'error'});
      } else {
        const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
        enqueueSnackbar(`Failed to save flowtest: ${errorData}`, { variant: 'error'});
      }
    }
  },[updateFlowTest.data, updateFlowTest.error])

  useEffect(() => {
    if (getFlowTest.data) {
      const retrievedFlowtest = getFlowTest.data
      const initialFlow = retrievedFlowtest.flowData ? JSON.parse(retrievedFlowtest.flowData) : []
      console.debug('Get flow nodes: ', initialFlow.nodes)
      console.debug('Get flow edges: ', initialFlow.edges)
      setNodes(initialFlow.nodes || [])
      setEdges(initialFlow.edges || [])
      setFlowTest(retrievedFlowtest)
    } else if (getFlowTest.error) {
      const error = getFlowTest.error
      if (!error.response) {
        enqueueSnackbar(`Failed to get flowtest: ${error}`, { variant: 'error'});
      } else {
        const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
        enqueueSnackbar(`Failed to get flowtest: ${errorData}`, { variant: 'error'});
      }
    }
  },[getFlowTest.data, getFlowTest.error])

  const onSaveClick = () => {
    if (flowTest.id && flowTestId) handleSaveFlow(flowTest.name)
    else setSaveDialogOpen(true);
  }

  const onConfirmSaveName = (flowTestName) => {
    setSaveDialogOpen(false)
    handleSaveFlow(flowTestName)
  }

  // Initialization
  useEffect(() => {
    if (flowTestId) {
      getFlowTest.request(flowTestId)
    } else {
        const initialNodes = location.state && location.state.initialNodes ? location.state.initialNodes : undefined;
        if (initialNodes != undefined) {
          const nodes = []
          const edges = []
          nodes.push({ id: '0', type: 'startNode', position: { x: 150, y: 150 }, deletable: false })
          for (let i = 1; i <= initialNodes.length; i++) {
            nodes.push({
              id: `${i}`,
              type: initialNodes[i-1].type,
              position: { x: 150 + (i * 500), y: 50 },
              data: initialNodes[i-1]
            })

            edges.push({
              id: `reactflow__edge-${i-1}-${i}`,
              source: `${i-1}`,
              sourceHandle: null,
              target: `${i}`,
              targetHandle: null,
              type: "buttonedge"
            })
          }
          setNodes(nodes);
          setEdges(edges);
          setIsDirty(true);
        } else {
          setNodes([{ id: '0', type: 'startNode', position: { x: 150, y: 150 }, deletable: false }])
          setEdges([])
          setIsDirty(false);
        }

        setFlowTest({
          name: 'Untitled chatflow'
        })
    }
  }, []);

  const isValidConnection = (connection) => {
    let canConnect = true
    // Only 1 outgoing edge from each (source, sourceHandle) is allowed 
    // as we only support sequential graphs for now
    reactFlowInstance.getEdges().map((edge) => {
      if (connection.source === edge.source && connection.sourceHandle === edge.sourceHandle) {
        canConnect = false
      }
    })

    // multiple incoming edges are only allowed for request nodes
    const nodes = reactFlowInstance.getNodes();
    const nodeType = nodes.find((node) => node.id === connection.target).type;
    if (nodeType != 'requestNode') {
      reactFlowInstance.getEdges().map((edge) => {
        if (connection.target === edge.target) {
          canConnect = false
        }
      })
    }
    return canConnect;
  }

  // graph

  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  const [graphRun, setGraphRun] = useState(false)
  const [graphRunLogs, setGraphRunLogs] = useState(undefined)

  const onGraphComplete = (result, logs) => {
    console.debug('Graph complete callback: ', result)
    setGraphRun(true);
    setGraphRunLogs(logs);
    if (result[0] == 'Success') {
      enqueueSnackbar('FlowTest Run Success!', { variant: 'success' });
    } else if (result[0] == 'Failed') {
      enqueueSnackbar('FlowTest Run Failed!', { variant: 'error'});
    }
    runnableEdges(false)
  }

  const [authKey, setAuthKey] = React.useState(undefined);

  // load flowtest

  const handleImport = (e) => {
    if (!e.target.files) return

    if (e.target.files.length === 1) {
        const file = e.target.files[0]
        const { name } = file

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target

            const flowData = JSON.parse(result);
            console.debug(flowData)

            setNodes(flowData.nodes || []);
            setEdges(flowData.edges || []);
            setIsDirty(true);
        }
        reader.readAsText(file)
    }
  }

  return (
    <>
        <Box>
              <AppBar position="fixed" elevation={1}>
                  <Toolbar>
                      <Box>
                          <ButtonBase title='Back' sx={{ borderRadius: '50%' }}>
                              <Avatar
                                  variant='rounded'
                                  sx={{
                                      ...theme.typography.commonAvatar,
                                      ...theme.typography.mediumAvatar,
                                      transition: 'all .2s ease-in-out',
                                      background: theme.palette.secondary.light,
                                      color: theme.palette.secondary.dark,
                                      '&:hover': {
                                          background: theme.palette.secondary.dark,
                                          color: theme.palette.secondary.light
                                      }
                                  }}
                                  color='inherit'
                                  onClick={() => {
                                      if (isDirty) setPromptDialogOpen(true)
                                      else window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate('/', { replace: true })
                                    }
                                  }
                              >
                                  <IconChevronLeft stroke={1.5} size='1.3rem' />
                              </Avatar>
                          </ButtonBase>
                      </Box>
                      <Typography
                          component="div"
                          sx={{
                              flexGrow: 1,
                              fontSize: '1.5rem',
                              fontWeight: 600,
                              ml: 2
                          }}
                      >
                          {isDirty && <strong style={{ color: theme.palette.primary.light }}>*</strong>} {flowTest.name}
                      </Typography>
                      {/* <button onClick={() => {
                        const result = openApiClient.createCollection('');
                        console.log(result);
                      }}>Get all nodes</button> */}
                      <SelectAuthComponent onSelectAuthKey={setAuthKey}/>
                      <ButtonBase title='Save' sx={{ borderRadius: '50%', mr: 2 }}>
                          <Avatar
                              variant='rounded'
                              sx={{
                                  ...theme.typography.commonAvatar,
                                  ...theme.typography.mediumAvatar,
                                  transition: 'all .2s ease-in-out',
                                  background: theme.palette.primary.light,
                                  color: theme.palette.primary.dark,
                                  '&:hover': {
                                      background: theme.palette.primary.dark,
                                      color: theme.palette.primary.light
                                  }
                              }}
                              color='inherit'
                              onClick={onSaveClick}
                          >
                              <IconDeviceFloppy stroke={1.5} size='1.3rem' />
                          </Avatar>
                      </ButtonBase>
                      <ButtonBase title='Export FlowTest' sx={{ borderRadius: '50%', mr: 2 }} color='black'>
                          <Avatar
                              variant='rounded'
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                '&:hover': {
                                    background: theme.palette.primary.dark,
                                    color: theme.palette.primary.light
                                }
                              }}
                              color='inherit'
                              onClick={() => {
                                try {
                                  if (reactFlowInstance) {
                                    const rfInstanceObject = reactFlowInstance.toObject()
                                    const flowData = JSON.stringify(rfInstanceObject)
                                    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(flowData)
                  
                                    let exportFileDefaultName = `${flowTest.name}.json`
                    
                                    let linkElement = document.createElement('a')
                                    linkElement.setAttribute('href', dataUri)
                                    linkElement.setAttribute('download', exportFileDefaultName)
                                    linkElement.click()
                                  }                                  
                                } catch (e) {
                                    console.error(e)
                                }
                              }}
                          >
                              <ImportExportIcon stroke={1.5} size='1.3rem' />
                          </Avatar>
                      </ButtonBase>
                      <ButtonBase component="label" title='Load FlowTest' sx={{ borderRadius: '50%', mr: 2 }} color='black'>
                          <Avatar
                              variant='rounded'
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                '&:hover': {
                                    background: theme.palette.primary.dark,
                                    color: theme.palette.primary.light
                                }
                              }}
                              color='inherit'
                          >
                              <UploadFileIcon stroke={1.5} size='1.3rem' />
                          </Avatar>
                          <input type='file' accept=".json" hidden onChange={(e) => handleImport(e)} />
                      </ButtonBase>
                      { graphRun && 
                        <ButtonBase title='View Logs' sx={{ borderRadius: '50%', mr: 2 }} color='black'>
                          <Avatar
                              variant='rounded'
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                '&:hover': {
                                    background: theme.palette.primary.dark,
                                    color: theme.palette.primary.light
                                }
                              }}
                              color='inherit'
                              onClick={toggleDrawer(true)}
                          >
                              <IconFiles stroke={1.5} size='1.3rem' />
                          </Avatar>
                        </ButtonBase> 
                      }
                        <Drawer
                          anchor="right"
                          open={state}
                          onClose={toggleDrawer(false)}
                        >
                            <Box
                              sx={{ width: 400 }}
                              role="presentation"
                              onClick={toggleDrawer(false)}
                              onKeyDown={toggleDrawer(false)}
                            >
                              {graphRunLogs != undefined && (
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Logs</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {graphRunLogs.map((graphRunLog, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {graphRunLog}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                              )}
                            </Box>
                        </Drawer>
                  </Toolbar>
              </AppBar>
              <Box sx={{pt: '70px', height: '100vh', width: '100%' }}>
                  <div className='reactflow-parent-wrapper'>
                      <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                          <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodeDragStop={() => setIsDirty(true)}
                            isValidConnection={isValidConnection}
                            fitView
                            >
                                <Controls>
                                  <ControlButton 
                                    onClick={() => {
                                      runnableEdges(true);
                                      const g = new Graph(reactFlowInstance.getNodes(), reactFlowInstance.getEdges(), onGraphComplete, authKey, flowTestApi.runRequest);
                                      g.run();
                                    }} title="run">
                                    <div>Run</div>
                                  </ControlButton>
                                </Controls>
                                <Background variant='dots' gap={12} size={1} />
                                <AddNodes />
                          </ReactFlow>
                      </div>
                  </div>
              </Box>
              <SaveDialog show={saveDialogOpen} onCancel={() => setSaveDialogOpen(false)} onConfirm={onConfirmSaveName} />
              <SelectAuthComponent show={envDialogOpen} onCancel={() => setEnvDialogOpen(false)} />
              <PromptDialog open={promptDialogOpen} closePromptDialog={() => setPromptDialogOpen(false)} />
        </Box>
    </>
  );
}

export default Flow