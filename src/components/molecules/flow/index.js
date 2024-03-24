import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background, ControlButton } from 'reactflow';
import 'reactflow/dist/style.css';
import { cloneDeep, isEqual } from 'lodash';

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
import { useTabStore } from 'stores/TabStore';
import FlowNode from 'components/atoms/flow/FlowNode';
import { Popover } from '@headlessui/react';
import { generateFlowData } from './flowtestai';
import { GENAI_MODELS } from 'constants/Common';
import { toast } from 'react-toastify';

const StartNode = () => (
  <FlowNode title='Start' handleLeft={false} handleRight={true} handleRightData={{ type: 'source' }}></FlowNode>
);

const init = (flowData) => {
  // Initialization
  if (flowData && flowData.nodes && flowData.edges) {
    return {
      nodes: flowData.nodes,
      edges: flowData.edges,
    };
  } else if (flowData && flowData.nodes && !flowData.edges) {
    // AI prompt generated
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
    for (let i = 0; i < flowData.nodes.length; i++) {
      nodes.push({
        id: `${i + 2}`,
        type: flowData.nodes[i].type,
        position: { x: 150 + (i + 1) * 500, y: 50 },
        data: flowData.nodes[i],
      });
      edges.push({
        id: `reactflow__edge-${i + 1}-${i + 2}`,
        source: `${i + 1}`,
        sourceHandle: null,
        target: `${i + 2}`,
        targetHandle: null,
        type: 'buttonedge',
      });
    }
    return {
      nodes,
      edges,
    };
  } else {
    return {
      nodes: [
        { id: '0', type: 'startNode', position: { x: 150, y: 150 }, deletable: false },
        { id: '1', type: 'authNode', position: { x: 400, y: 150 }, data: {}, deletable: false },
      ],
      edges: [
        {
          id: `reactflow__edge-0-1`,
          source: `0`,
          sourceHandle: null,
          target: `1`,
          targetHandle: null,
          type: 'buttonedge',
        },
      ],
    };
  }
};

const Flow = ({ tabId, collectionId, flowData }) => {
  console.log(` \n \n \n RENDERING FLOW FOR tabId: ${tabId} \n \n \n`);
  useEffect(() => {
    // Action to perform on tab change
    console.log(`Tab changed to: ${tabId}`);
    console.log(flowData);
    // perform actions based on the new tabId
    const result = init(cloneDeep(flowData));
    setNodes(result.nodes);
    setEdges(result.edges);
  }, [tabId]);

  const setCanvasDirty = () => {
    console.debug('set canvas dirty');
    const tab = useTabStore.getState().tabs.find((t) => t.id === tabId);
    if (tab) {
      tab.isDirty = true;
      tab.flowData = {
        nodes: nodes.map((node) => {
          const _node = JSON.parse(JSON.stringify(node));
          return { ..._node };
        }),
        edges: edges.map((edge) => {
          return {
            ...edge,
            animated: false,
          };
        }),
      };
    }
  };

  // notification
  // eslint-disable-next-line no-unused-vars
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // skip inital render
    if (flowData === undefined || (isEqual(nodes, []) && isEqual(edges, []))) {
      return;
    }
    if (flowData && isEqual(JSON.parse(JSON.stringify(nodes)), flowData.nodes) && isEqual(edges, flowData.edges)) {
      console.debug('canvas is unchanged');
      return;
    }
    setCanvasDirty();
  }, [nodes, edges]);

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
    },
    [reactFlowInstance],
  );

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
  // eslint-disable-next-line no-unused-vars
  const [graphRun, setGraphRun] = useState(false);
  // eslint-disable-next-line no-unused-vars
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
    <div className='w-full h-full'>
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
        onNodeDragStop={() => setCanvasDirty()}
        isValidConnection={isValidConnection}
        //fitView
      >
        <Controls>
          <ControlButton
            onClick={() => {
              runnableEdges(true);
              const g = new Graph(
                cloneDeep(reactFlowInstance.getNodes()),
                cloneDeep(reactFlowInstance.getEdges()),
                collectionId,
                onGraphComplete,
              );
              g.run();
            }}
            title='run'
          >
            Run
          </ControlButton>
        </Controls>
        <Background variant='dots' gap={12} size={1} />
        <div className='absolute right-4 z-[2000] max-w-sm px-4 '>
          <button
            type='button'
            onClick={() => {
              generateFlowData('Add a pet then get all pets with status available', GENAI_MODELS.openai, collectionId)
                .then((flowData) => {
                  const result = init(flowData);
                  console.log(result);
                  setNodes(result.nodes);
                  setEdges(result.edges);
                })
                .catch((error) => {
                  console.log(error);
                  toast.error(`Error while generating flow data`);
                });
            }}
          >
            FlowTestAI
          </button>
        </div>
        <AddNodes collectionId={collectionId} />
      </ReactFlow>
    </div>
  );
};

Flow.propTypes = {
  tabId: PropTypes.string.isRequired,
  collectionId: PropTypes.string.isRequired,
  flowData: PropTypes.object.isRequired,
};

export default Flow;
