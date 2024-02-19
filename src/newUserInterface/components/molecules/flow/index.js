import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

// react flow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background, ControlButton } from 'reactflow';
import { Handle, Position } from "reactflow"
import 'reactflow/dist/style.css'

// css
import '../../../../flow/index.css'

// notification
import { useSnackbar } from 'notistack';

// API
import flowTestApi from '../../../../api/flowtest';

// icons
//import { IconDeviceFloppy, IconChevronLeft, IconFiles } from '@tabler/icons-react';

//import SelectAuthComponent from './SelectAuthComponent';
import CustomEdge from '../../../../flow/edges/ButtonEdge';

// theme
//import theme from './theme';

import AddNodes from '../../../../flow/AddNodes';
// import SaveDialog from './SaveDialog';
import wrapper from '../../../../api/wrapper';
//import PromptDialog from './PromptDialog';
import Graph from '../../../../flow/graph/Graph'
import RequestNode from '../../../../flow/nodes/RequestNode';
import OutputNode from '../../../../flow/nodes/OutputNode';
import EvaluateNode from '../../../../flow/nodes/EvaluateNode';
import DelayNode from '../../../../flow/nodes/DelayNode';

import concatRoute from '../../../utils/filesystem.js'

const StartNode = () => (
  <div style={{width: '150px', borderRadius: '5px', padding: '10px', color: '#555', border:'2px solid #ddd', textAlign:'center', fontSize:'20px', background:'#fff', fontWeight:'bold'}}>
    <div>Start</div>
    <Handle style={{}} type="source" position={Position.Right} />
  </div>
);

const Flow = ({rootPath, name}) => {
  const location = useLocation();

  const getFlowTest = wrapper(flowTestApi.getSpecificFlowTest)

  // notification
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [flowTest, setFlowTest]= useState({})

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

      let nodeData = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof nodeData === 'undefined' || !nodeData) {
        return;
      }

      nodeData = JSON.parse(nodeData)

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
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

  // Initialization
  useEffect(() => {
    if (rootPath && name) {
      getFlowTest.request(concatRoute(rootPath, name))
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
          name: 'Untitled Flow'
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
                  const g = new Graph(reactFlowInstance.getNodes(), reactFlowInstance.getEdges(), onGraphComplete, {accessId: '', accessKey: ''}, flowTestApi.runRequest);
                  g.run();
                }} title="run">
                <div>Run</div>
              </ControlButton>
            </Controls>
            <Background variant='dots' gap={12} size={1} />
            <AddNodes />
      </ReactFlow>
    </div>
  );
}

export default Flow