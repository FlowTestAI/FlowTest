import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

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
  Button 
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// notification
import { useSnackbar } from 'notistack';

// API
import flowTestApi from '../api/flowtest'

// icons
import { IconBrandCodesandbox, IconDeviceFloppy, IconChevronLeft } from '@tabler/icons-react';

import RequestNode from './RequestNode';
import EnvDialog from './EnvDialog';

// theme
import theme from './theme';

import AddRequestNodes from './AddRequestNodes';
import SaveDialog from './SaveDialog';
import wrapper from '../api/wrapper';
import PromptDialog from './PromptDialog';
import GraphRun from './graph/GraphRun';

const StartNode = () => (
  <div style={{width: '150px', borderRadius: '5px', padding: '10px', color: '#555', border:'2px solid #ddd', textAlign:'center', fontSize:'20px', background:'#fff', fontWeight:'bold'}}>
    <div>Start</div>
    <Handle style={{}} type="source" position={Position.Right} />
  </div>
);

const Flow = () => {
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
      requestNode: RequestNode 
    }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

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

  const getId = () => `dndnode_${(reactFlowInstance.getNodes().length)++}`;

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
        type: 'requestNode',
        position,
        data: nodeData
      };

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
          const rfInstanceObject = reactFlowInstance.toObject()
          rfInstanceObject.nodes = nodes
          const flowData = JSON.stringify(rfInstanceObject)

          console.log(`save flow ${flowData}`)

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
      setFlowTest(updateFlowTest.data)
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
      console.log('get flow')
      console.log(initialFlow.nodes)
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
          setNodes([{ id: '0', type: 'startNode', position: { x: 150, y: 150 } }])
          setEdges([])

          setFlowTest({
            name: 'Untitled chatflow'
          })
      }

      return () => {
          setIsDirty(false);
      }
  }, []);

  const isValidConnection = (connection) => {
    let canConnect = true
    reactFlowInstance.getEdges().map((edge) => {
      if (connection.source === edge.source || connection.target === edge.target) {
        canConnect = false
      }
    })
    return canConnect;
  }

  // graph

  const onGraphComplete = (result) => {
    console.log('callback: ', result)
    if (result[0] == 'Success') {

    } else if (result[0] == 'Failed') {
      
    }
    runnableEdges(false)
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
                      <button onClick={() => getAllNodes()}>Get all nodes</button>
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
                      <ButtonBase title='Environment' sx={{ borderRadius: '50%', mr: 2 }} color='black'>
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
                              onClick={() => setEnvDialogOpen(true)}
                          >
                              <IconBrandCodesandbox stroke={1.5} size='1.3rem' />
                          </Avatar>
                      </ButtonBase>
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
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodeDragStop={() => setIsDirty(true)}
                            isValidConnection={isValidConnection}
                            >
                                <Controls>
                                  <ControlButton 
                                    onClick={() => {
                                      runnableEdges(true)
                                      GraphRun(reactFlowInstance.getNodes(), reactFlowInstance.getEdges(), onGraphComplete)
                                    }} title="run">
                                    <div>Run</div>
                                  </ControlButton>
                                </Controls>
                                <Background variant='dots' gap={12} size={1} />
                                <AddRequestNodes />
                          </ReactFlow>
                      </div>
                  </div>
              </Box>
              <SaveDialog show={saveDialogOpen} onCancel={() => setSaveDialogOpen(false)} onConfirm={onConfirmSaveName} />
              <EnvDialog show={envDialogOpen} onCancel={() => setEnvDialogOpen(false)} />
              <PromptDialog open={promptDialogOpen} closePromptDialog={() => setPromptDialogOpen(false)} />
        </Box>
    </>
  );
}

export default Flow