import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// react flow
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background, ControlButton } from 'reactflow';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

// css
import '../../../../index.css';

// notification
// import { useSnackbar } from 'notistack';

// API
import flowTestApi from '../../../../api/flowtest';

// icons
// import { IconDeviceFloppy, IconChevronLeft, IconFiles } from '@tabler/icons-react';

import RequestNode from '../../../../flow/nodes/RequestNode';
// import SelectAuthComponent from '../../../flow/SelectAuthComponent';
import CustomEdge from '../../../../flow/edges/ButtonEdge';

// theme
// import theme from '../../../flow/theme';

import AddNodes from '../../../../flow/AddNodes';
// import SaveDialog from '../../../flow/SaveDialog';
// import wrapper from '../../../api/wrapper';
// import PromptDialog from '../../../flow/PromptDialog';
import Graph from '../../../../flow/graph/Graph';
import OutputNode from '../../../../flow/nodes/OutputNode';
import EvaluateNode from '../../../../flow/nodes/EvaluateNode';
// import DelayNode from '@/flow/nodes/DelayNode';
// import DelayNode from '../../../../flow/nodes/DelayNode';
import DelayNode from 'flow/nodes/DelayNode';

const StartNode = () => (
  <div className='tw-w-28 tw-rounded tw-border-2 tw-border-slate-300 tw-bg-white tw-px-4 tw-py-2 tw-text-center tw-text-base tw-text-slate-600'>
    <div>Start</div>
    <Handle style={{}} type='source' position={Position.Right} />
  </div>
);

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      requestNode: RequestNode,
      outputNode: OutputNode,
      evaluateNode: EvaluateNode,
      delayNode: DelayNode,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      buttonedge: CustomEdge,
    }),
    [],
  );

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      type: 'buttonedge',
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  useEffect(() => {
    setNodes([
      {
        id: '0',
        type: 'startNode',
        position: { x: 150, y: 150 },
        deletable: false,
      },
    ]);
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

  const runnableEdges = (runnable) => {
    const updatedEdges = reactFlowInstance.getEdges().map((edge) => {
      return {
        ...edge,
        animated: runnable,
      };
    });
    setEdges(updatedEdges);
  };

  const [graphRun, setGraphRun] = useState(false);
  const [graphRunLogs, setGraphRunLogs] = useState(undefined);
  const onGraphComplete = (result, logs) => {
    console.debug('Graph complete callback: ', result);
    setGraphRun(true);
    setGraphRunLogs(logs);
    if (result[0] == 'Success') {
      alert('FlowTest Run Success!', { variant: 'success' });
    } else if (result[0] == 'Failed') {
      alert('FlowTest Run Failed!', { variant: 'error' });
    }
    runnableEdges(false);
  };

  const [authKey, setAuthKey] = React.useState(undefined);

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
        // onDrop={onDrop}
        // onDragOver={onDragOver}
        // onNodeDragStop={() => setIsDirty(true)}
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
                authKey,
                flowTestApi.runRequest,
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
