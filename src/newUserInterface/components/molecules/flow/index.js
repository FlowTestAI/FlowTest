import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ReactFlow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background, ControlButton } from 'reactflow';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

// css
import './index.css';

// notification
import { useSnackbar } from 'notistack';

// ReactFlow Canvas
import CustomEdge from './edges/ButtonEdge';

import AddNodes from './AddNodes';
import Graph from './graph/Graph';
import RequestNode from './nodes/RequestNode';
import OutputNode from './nodes/OutputNode';
import EvaluateNode from './nodes/EvaluateNode';
import DelayNode from './nodes/DelayNode';

// file system
import AuthNode from './nodes/AuthNode';

const StartNode = () => (
  <div
    style={{
      width: '150px',
      borderRadius: '5px',
      padding: '10px',
      color: '#555',
      border: '2px solid #ddd',
      textAlign: 'center',
      fontSize: '20px',
      background: '#fff',
      fontWeight: 'bold',
    }}
  >
    <div>Start</div>
    <Handle style={{}} type='source' position={Position.Right} />
  </div>
);

const Flow = () => {
  const location = useLocation();

  // notification
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [flowTest, setFlowTest] = useState({});

  const [isDirty, setIsDirty] = useState(false);

  const nodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      requestNode: RequestNode,
      outputNode: OutputNode,
      evaluateNode: EvaluateNode,
      delayNode: DelayNode,
      authNode: AuthNode,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      buttonedge: CustomEdge,
    }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      type: 'buttonedge',
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const runnableEdges = (runnable) => {
    const updatedEdges = reactFlowInstance.getEdges().map((edge) => {
      return {
        ...edge,
        animated: runnable,
      };
    });
    setEdges(updatedEdges);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const getId = () => {
    const currentIds = reactFlowInstance.getNodes().map((node) => Number(node.id));
    const currentMaxId = Math.max(...currentIds);
    return `${currentMaxId + 1}`;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      let nodeData = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof nodeData === 'undefined' || !nodeData) {
        return;
      }

      nodeData = JSON.parse(nodeData);

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: nodeData.type,
        position,
        data: nodeData,
      };
      console.debug('Dropped node: ', newNode);

      setNodes((nds) => nds.concat(newNode));
      setIsDirty(true);
    },
    [reactFlowInstance],
  );

  const getAllNodes = () => {
    reactFlowInstance.getNodes().map((node) => console.log(node));
    reactFlowInstance.getEdges().map((edge) => console.log(edge));
  };

  // useEffect(() => {
  //   if (getFlowTest.data) {
  //     const retrievedFlowtest = getFlowTest.data;
  //     const initialFlow = retrievedFlowtest.flowData ? JSON.parse(retrievedFlowtest.flowData) : [];
  //     console.debug('Get flow nodes: ', initialFlow.nodes);
  //     console.debug('Get flow edges: ', initialFlow.edges);
  //     setNodes(initialFlow.nodes || []);
  //     setEdges(initialFlow.edges || []);
  //     setFlowTest(retrievedFlowtest);
  //   } else if (getFlowTest.error) {
  //     const error = getFlowTest.error;
  //     if (!error.response) {
  //       enqueueSnackbar(`Failed to get flowtest: ${error}`, { variant: 'error' });
  //     } else {
  //       const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`;
  //       enqueueSnackbar(`Failed to get flowtest: ${errorData}`, { variant: 'error' });
  //     }
  //   }
  // }, [getFlowTest.data, getFlowTest.error]);

  // Initialization
  useEffect(() => {
    // if (rootPath && name) {
    //   //getFlowTest.request(concatRoute(rootPath, name));
    // } else {
    const initialNodes = location.state && location.state.initialNodes ? location.state.initialNodes : undefined;
    if (initialNodes != undefined) {
      const nodes = [
        { id: '0', type: 'startNode', position: { x: 150, y: 150 }, deletable: false },
        { id: '1', type: 'authNode', position: { x: 400, y: 150 }, data: {}, deletable: false },
      ];
      const edges = [
        {
          id: `reactflow__edge-0-1`,
          source: `0`,
          sourceHandle: null,
          target: `1`,
          targetHandle: null,
          type: 'buttonedge',
        },
      ];

      for (let i = 2; i <= initialNodes.length; i++) {
        nodes.push({
          id: `${i}`,
          type: initialNodes[i - 1].type,
          position: { x: 150 + i * 500, y: 50 },
          data: initialNodes[i - 1],
        });

        edges.push({
          id: `reactflow__edge-${i - 1}-${i}`,
          source: `${i - 1}`,
          sourceHandle: null,
          target: `${i}`,
          targetHandle: null,
          type: 'buttonedge',
        });
      }
      setNodes(nodes);
      setEdges(edges);
      setIsDirty(true);
    } else {
      setNodes([
        { id: '0', type: 'startNode', position: { x: 150, y: 150 }, deletable: false },
        { id: '1', type: 'authNode', position: { x: 400, y: 150 }, data: {}, deletable: false },
      ]);
      setEdges([
        {
          id: `reactflow__edge-0-1`,
          source: `0`,
          sourceHandle: null,
          target: `1`,
          targetHandle: null,
          type: 'buttonedge',
        },
      ]);
      setIsDirty(false);
    }

    setFlowTest({
      name: 'Untitled Flow',
    });
    //}
  }, []);

  const isValidConnection = (connection) => {
    let canConnect = true;
    // Only 1 outgoing edge from each (source, sourceHandle) is allowed
    // as we only support sequential graphs for now
    reactFlowInstance.getEdges().map((edge) => {
      if (connection.source === edge.source && connection.sourceHandle === edge.sourceHandle) {
        canConnect = false;
      }
    });

    // multiple incoming edges are only allowed for request nodes
    const nodes = reactFlowInstance.getNodes();
    const nodeType = nodes.find((node) => node.id === connection.target).type;
    if (nodeType != 'requestNode') {
      reactFlowInstance.getEdges().map((edge) => {
        if (connection.target === edge.target) {
          canConnect = false;
        }
      });
    }
    return canConnect;
  };

  // graph

  const [graphRun, setGraphRun] = useState(false);
  const [graphRunLogs, setGraphRunLogs] = useState(undefined);

  const onGraphComplete = (result, logs) => {
    console.debug('Graph complete callback: ', result);
    setGraphRun(true);
    setGraphRunLogs(logs);
    if (result[0] == 'Success') {
      enqueueSnackbar('FlowTest Run Success!', { variant: 'success' });
    } else if (result[0] == 'Failed') {
      enqueueSnackbar('FlowTest Run Failed!', { variant: 'error' });
    }
    runnableEdges(false);
  };

  return (
    <div className='tw-flex-auto'>
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
              const g = new Graph(
                reactFlowInstance.getNodes(),
                reactFlowInstance.getEdges(),
                onGraphComplete,
                { accessId: '', accessKey: '' },
                undefined,
              );
              g.run();
            }}
            title='run'
          >
            <div>Run</div>
          </ControlButton>
        </Controls>
        <Background variant='dots' gap={12} size={1} />
        <AddNodes />
      </ReactFlow>
    </div>
  );
};

export default Flow;
