import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { useTabStore } from './TabStore';
import { getDefaultValue } from 'utils/common';

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useCanvasStore = create((set, get) => ({
  nodes: [],
  edges: [],
  logs: [],
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    useTabStore.getState().updateFlowTestEdges(get().edges);
  },
  onConnect: (connection) => {
    const newEdge = {
      ...connection,
      type: 'buttonedge',
    };
    set({
      edges: addEdge(newEdge, get().edges),
    });
    useTabStore.getState().updateFlowTestEdges(get().edges);
  },
  setNodes: (nodes) => {
    set({ nodes });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setEdges: (edges) => {
    set({ edges });
    useTabStore.getState().updateFlowTestEdges(get().edges);
  },
  setLogs: (logs) => {
    set({ logs });
  },
  setAuthNodeType: (nodeId, authType) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { type: authType };
        }

        return node;
      }),
    });
  },
  setBasicAuthValues: (nodeId, attribute, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            [attribute]: value,
          };
        }

        return node;
      }),
    });
  },
  setRequestNodeUrl: (nodeId, url) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            url,
          };
        }

        return node;
      }),
    });
  },
  requestNodeAddPreRequestVar: (nodeId, name, type) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          const newId = name;
          const newVar = {
            type: type,
            value: getDefaultValue(type),
          };
          node.data = {
            ...node.data,
            preReqVars: {
              ...node.data.preReqVars,
              [newId]: newVar,
            },
          };
        }

        return node;
      }),
    });
  },
  requestNodeDeletePreRequestVar: (nodeId, id) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          const { [id]: _, ...newVariables } = node.data.preReqVars;

          node.data = {
            ...node.data,
            preReqVars: newVariables,
          };
        }

        return node;
      }),
    });
  },
  requestNodeChangePreRequestVar: (nodeId, id, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          const updateVar = {
            type: node.data.preReqVars[id].type,
            value,
          };

          node.data = {
            ...node.data,
            preReqVars: {
              ...node.data.preReqVars,
              [id]: updateVar,
            },
          };
        }

        return node;
      }),
    });
  },
  setRequestNodeBody: (nodeId, type, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          if (type === 'None') {
            node.data = {
              ...node.data,
              requestBody: {
                type,
              },
            };
          } else if (type === 'raw-json') {
            node.data = {
              ...node.data,
              requestBody: {
                type,
                body: data,
              },
            };
          } else if (type === 'form-data') {
            node.data = {
              ...node.data,
              requestBody: {
                type,
                body: {
                  ...node.data.requestBody?.body,
                  ...data,
                },
              },
            };
          }
        }

        return node;
      }),
    });
  },
  setEvaluateNodeVariable: (nodeId, name, type, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            variables: {
              ...node.data.variables,
              [name]: {
                type,
                value,
              },
            },
          };
        }

        return node;
      }),
    });
  },
  setEvaluateNodeOperator: (nodeId, operator) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            operator,
          };
        }

        return node;
      }),
    });
  },
  setDelayNodeValue: (nodeId, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            delay: value,
          };
        }

        return node;
      }),
    });
  },
  setOutputNode: (nodeId, output) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            output,
          };
        }

        return node;
      }),
    });
  },
  unSetOutputNode: (nodeId) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {};
        }

        return node;
      }),
    });
  },
}));

export default useCanvasStore;
