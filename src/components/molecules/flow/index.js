import React, { useCallback, useMemo, useState } from 'react';
import { PropTypes } from 'prop-types';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background, ControlButton } from 'reactflow';
import 'reactflow/dist/style.css';
import { cloneDeep, isEqual } from 'lodash';
import { toast } from 'react-toastify';

// css
import './index.css';

// ReactFlow Canvas
import CustomEdge from './edges/ButtonEdge';

import AddNodes from './AddNodes';
import RequestNode from './nodes/RequestNode';
import OutputNode from './nodes/OutputNode';
import EvaluateNode from './nodes/EvaluateNode';
import DelayNode from './nodes/DelayNode';
import AuthNode from './nodes/AuthNode';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import useCollectionStore from 'stores/CollectionStore';
import { useTabStore } from 'stores/TabStore';
import Graph from './graph/Graph';
import ComplexNode from './nodes/ComplexNode';

const StartNode = () => (
  <FlowNode title='Start' handleLeft={false} handleRight={true} handleRightData={{ type: 'source' }}></FlowNode>
);

export const init = (flowData) => {
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

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  setLogs: state.setLogs,
});

const Flow = ({ collectionId }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, setLogs } =
    useCanvasStore(selector);
  //console.log(nodes);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      requestNode: RequestNode,
      outputNode: OutputNode,
      evaluateNode: EvaluateNode,
      delayNode: DelayNode,
      authNode: AuthNode,
      complexNode: ComplexNode,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      buttonedge: CustomEdge,
    }),
    [],
  );

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

      setNodes([...useCanvasStore.getState().nodes, newNode]);
    },
    [reactFlowInstance],
  );

  const isValidConnection = (connection) => {
    // Only 1 outgoing edge from each (source, sourceHandle) is allowed
    // as we only support sequential graphs for now
    reactFlowInstance.getEdges().map((edge) => {
      if (connection.source === edge.source && connection.sourceHandle === edge.sourceHandle) {
        return false;
      }
    });

    const nodes = reactFlowInstance.getNodes();

    // self connecting edge not allowed
    const sourceNode = nodes.find((node) => node.id === connection.source).id;
    const targetNode = nodes.find((node) => node.id === connection.target).id;
    if (sourceNode === targetNode) {
      return false;
    }

    // multiple incoming edges are only allowed for request nodes
    const nodeType = nodes.find((node) => node.id === connection.target).type;
    if (nodeType != 'requestNode') {
      reactFlowInstance.getEdges().map((edge) => {
        if (connection.target === edge.target) {
          return false;
        }
      });
    }

    return true;
  };

  const onGraphComplete = (status, logs) => {
    setLogs(logs);
    if (status == 'Success') {
      toast.success('FlowTest Run Success! View Logs');
    } else if (status == 'Failed') {
      toast.error('FlowTest Run Failed! View Logs');
    }
    runnableEdges(false);
  };

  return (
    <div className='flex-auto'>
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
        //onNodeDragStop={() => setCanvasDirty()}
        isValidConnection={isValidConnection}
        fitView
      >
        <Controls>
          <ControlButton
            onClick={async () => {
              runnableEdges(true);
              const startTime = Date.now();
              try {
                let result = undefined;
                let g = undefined;
                let envVariables = {};

                const activeEnv = useCollectionStore
                  .getState()
                  .collections.find((c) => c.id === collectionId)
                  ?.environments.find((e) => e.name === useTabStore.getState().selectedEnv);
                if (activeEnv) {
                  envVariables = cloneDeep(activeEnv.variables);
                }

                // ============= flow =====================
                g = new Graph(
                  cloneDeep(reactFlowInstance.getNodes()),
                  cloneDeep(reactFlowInstance.getEdges()),
                  startTime,
                  result ? result.envVars : envVariables,
                  result ? result.logs : [],
                );
                result = await g.run();

                if (result.status === 'Failed') {
                  onGraphComplete(result.status, result.logs);
                  return;
                }

                result.logs.push(`Total time: ${Date.now() - startTime} ms`);
                onGraphComplete(result.status, result.logs);
              } catch (error) {
                toast.error(`Error running graph: ${error}`);
                runnableEdges(false);
              }
            }}
            title='run'
          >
            Run
          </ControlButton>
        </Controls>
        <Background variant='dots' gap={12} size={1} />
        <AddNodes collectionId={collectionId} />
      </ReactFlow>
    </div>
  );
};

Flow.propTypes = {
  collectionId: PropTypes.string.isRequired,
};

export default Flow;
