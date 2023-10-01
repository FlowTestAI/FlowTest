import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

// react flow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background } from 'reactflow';
import { Handle, Position } from "reactflow"
import 'reactflow/dist/style.css'

// css
import './index.css'

// MUI
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  ButtonBase, 
  Avatar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// notification
import { useSnackbar } from 'notistack';

// API
import flowTestApi from '../api/flowtest'

// icons
import { IconBrandCodesandbox, IconDeviceFloppy } from '@tabler/icons-react';

import RequestNode from './RequestNode';
import EnvDialog from './EnvDialog';

// theme
import theme from './theme';

import AddRequestNodes from './AddRequestNodes';
import SaveDialog from './SaveDialog';

const StartNode = () => (
  <div style={{width: '150px', borderRadius: '5px', padding: '10px', color: '#555', border:'2px solid #ddd', textAlign:'center', fontSize:'20px', background:'#fff', fontWeight:'bold'}}>
    <div>Start</div>
    <Handle style={{}} type="source" position={Position.Right} />
  </div>
);

const Flow = () => {
  const navigate = useNavigate()

  // notification
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [flowTest, setFlowTest]= useState({})
  const [drawer, setDrawer] = useState(false)

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

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  let id = 0;
  const getId = () => `dndnode_${id++}`;

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
  }

  // SAVE

  const handleSaveFlow = (flowTestName) => {
      if (reactFlowInstance) {
          const rfInstanceObject = reactFlowInstance.toObject()
          rfInstanceObject.nodes = nodes
          const flowData = JSON.stringify(rfInstanceObject)

          console.log(flowData)

          if (!flowTest.id) {
              const newFlowTestBody = {
                  name: flowTestName,
                  flowData
              }
              //flowTestApi.createNewFlowTest(newFlowTestBody)
              // success
              setFlowTest(newFlowTestBody)
              enqueueSnackbar('Saved FlowTest!', { variant: 'success' });
          } else {
              const updateBody = {
                  name: flowTestName,
                  flowData
              }
              flowTestApi.updateFlowTest(flowTest.id, updateBody)
          }
      }
  }

  const onSaveClick = () => {
    setSaveDialogOpen(true);
  }

  const onConfirmSaveName = (flowTestName) => {
    setSaveDialogOpen(false)
    handleSaveFlow(flowTestName)
  }

  // Initialization
  useEffect(() => {
      if (flowTestId) {
          flowTestApi.getSpecificFlowTest(flowTestId)
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

  // Side menu
  const sideMenu = () => {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => setDrawer(false)}
        onKeyDown={() => setDrawer(false)}
      >
        <List>
            <ListItem key="FlowTest" disablePadding>
              <ListItemButton>
                {/* <ListItemText primary="FlowTest" /> */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  FlowTest
                </Typography>
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem key="list" disablePadding>
              <ListItemButton>
                <ListItemText primary='Saved Flows' />
              </ListItemButton>
            </ListItem>
            <ListItem key="create" disablePadding>
              <ListItemButton onClick={() => navigate('/flow')}>
                <ListItemText primary='Create New Flow' />
              </ListItemButton>
            </ListItem>
        </List>
      </Box>
    );
  }

  return (
    <>
        <Box>
              <AppBar position="fixed" elevation={1}>
                  <Toolbar>
                      <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawer(true)}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Drawer
                        open={drawer}
                        onClose={() => setDrawer(false)}
                      >
                        {sideMenu()}
                      </Drawer>
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
                            >
                                <Controls />
                                <Background variant='dots' gap={12} size={1} />
                                <AddRequestNodes />
                          </ReactFlow>
                      </div>
                  </div>
              </Box>
              <SaveDialog show={saveDialogOpen} onCancel={() => setSaveDialogOpen(false)} onConfirm={onConfirmSaveName} />
              <EnvDialog show={envDialogOpen} onCancel={() => setEnvDialogOpen(false)} />
        </Box>
    </>
  );
}

export default Flow