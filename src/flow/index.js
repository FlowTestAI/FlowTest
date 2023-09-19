import React, { useCallback, useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background } from 'reactflow';

import 'reactflow/dist/style.css';
import RequestNode from './RequestNode';

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
  const nodeTypes = useMemo(() => ({ requestNode: RequestNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{pt: '70px', width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        >
            <Controls />
            <Background variant='dots' gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default Flow