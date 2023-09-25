import React, { useRef, useCallback, useMemo, useState } from 'react';

// react flow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css'
import './index.css'

// MUI
import { AppBar, Box, Toolbar, IconButton, Typography, ButtonBase, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// icons
import { IconBrandCodesandbox } from '@tabler/icons-react';

import RequestNode from './RequestNode';
import EnvDialog from './EnvDialog';

// theme
import theme from './theme';

import AddRequestNodes from './AddRequestNodes';

const initialNodes = [
  { id: '1', 
    type: 'requestNode', 
    position: { x: 0, y: 50 }, 
    data: 
    { 
      requestType: 'GET',
      variables: 
      {
        "uuid": "String"
      }
    } 
  },
  { id: '2', 
    type: 'requestNode', 
    position: { x: 100, y: 100 }, 
    data: 
    { 
      requestType: 'POST',
      variables: 
      {
        "uuid": "String"
      } 
    } 
  },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const Flow = () => {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  
  const nodeTypes = useMemo(() => ({ requestNode: RequestNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

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
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        FlowTest
                      </Typography>
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
                            >
                                <Controls />
                                <Background variant='dots' gap={12} size={1} />
                                <AddRequestNodes />
                          </ReactFlow>
                      </div>
                  </div>
              </Box>
              <EnvDialog show={envDialogOpen} onCancel={() => setEnvDialogOpen(false)} />
        </Box>
    </>
  );
}

export default Flow