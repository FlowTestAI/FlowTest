import React, { useRef, useCallback, useMemo, useState } from 'react';

// react flow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background } from 'reactflow';
import { Handle, Position } from "reactflow"
import 'reactflow/dist/style.css'

// css
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
  { id: '0', type: 'startNode', position: { x: 150, y: 150 } }
];

const StartNode = () => (
  <div style={{width: '150px', borderRadius: '5px', padding: '10px', color: '#555', border:'2px solid #ddd', textAlign:'center', fontSize:'20px', background:'#fff', fontWeight:'bold'}}>
    <div>Start</div>
    <Handle style={{}} type="source" position={Position.Right} />
  </div>
);

const Flow = () => {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  
  const nodeTypes = useMemo(() => (
    {
      startNode: StartNode, 
      requestNode: RequestNode 
    }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
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
    },
    [reactFlowInstance]
  );

  const getAllNodes = () => {
    reactFlowInstance.getNodes().map((node) => console.log(node))
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
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        FlowTest
                      </Typography>
                      <button onClick={() => getAllNodes()}>Get all nodes</button>
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