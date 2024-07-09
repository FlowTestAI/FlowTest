import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { useTabStore } from './TabStore';
import { getDefaultValue } from 'utils/common';

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useCanvasStore = create((set, get) => ({
  nodes: [],
  edges: [],
  collectionId: '',
  timeout: '60000',
  viewport: { x: 0, y: 0, zoom: 1 },
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
  setIntialState: ({ nodes, edges, viewport }) => {
    set((state) => ({ ...state, ...{ nodes, edges, viewport } }));
  },
  setNodes: (nodes) => {
    set({ nodes });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setEdges: (edges) => {
    set({ edges });
    useTabStore.getState().updateFlowTestEdges(get().edges);
  },
  setCollectionId: (collectionId) => {
    set({ collectionId });
  },
  setTimeout: (timeout) => {
    set({ timeout });
  },
  setViewport: (viewport) => {
    set({ viewport });
    useTabStore.getState().updateFlowTestViewport(get().viewport);
  },
  setAuthNodeType: (nodeId, authType) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          if (authType == 'no-auth') {
            node.data = {};
          } else {
            node.data = {
              ...node.data,
              type: authType,
            };
          }
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
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setRequestNodeType: (nodeId, requestType) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            requestType,
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
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
    useTabStore.getState().updateFlowTestNodes(get().nodes);
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
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  requestNodeAddPostResponseVar: (nodeId, name, type) => {
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
            postRespVars: {
              ...node.data.postRespVars,
              [newId]: newVar,
            },
          };
        }

        return node;
      }),
    });
  },
  requestNodeDeletePostResponseVar: (nodeId, id) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          const { [id]: _, ...newVariables } = node.data.postRespVars;

          node.data = {
            ...node.data,
            postRespVars: newVariables,
          };
        }

        return node;
      }),
    });
  },
  requestNodeChangePostResponseVar: (nodeId, id, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          const updateVar = {
            type: node.data.postRespVars[id].type,
            value,
          };

          node.data = {
            ...node.data,
            postRespVars: {
              ...node.data.postRespVars,
              [id]: updateVar,
            },
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
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
                body: data,
              },
            };
          }
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setAssertNodeVariable: (nodeId, name, type, value) => {
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
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setAssertNodeOperator: (nodeId, operator) => {
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
            ...node.data,
            delay: value,
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setOutputNode: (nodeId, output) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            output,
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  unSetOutputNode: (nodeId) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          if (node.data.output) {
            const { ['output']: _, ...data } = node.data;
            node.data = data;
          }
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setFlowForComplexNode: (nodeId, relativePath) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            relativePath,
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setVariableNodeName: (nodeId, name) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            variable: {
              ...node.data?.variable,
              name,
            },
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setVariableNodeType: (nodeId, type) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            variable: {
              ...node.data?.variable,
              type,
              value: type === 'Expression' ? {} : getDefaultValue(type),
            },
          };
        }

        return node;
      }),
    });
  },
  setVariableNodeExpressionsVariable: (nodeId, name, type, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            variable: {
              ...node.data.variable,
              value: {
                ...node.data.variable.value,
                variables: {
                  ...node.data.variable.value?.variables,
                  [name]: {
                    type,
                    value,
                  },
                },
              },
            },
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
  setVariableNodeExpressionOperator: (nodeId, operator) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            variable: {
              ...node.data.variable,
              value: {
                ...node.data.variable.value,
                operator,
              },
            },
          };
        }

        return node;
      }),
    });
  },
  variableNodeChangeVar: (nodeId, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = {
            ...node.data,
            variable: {
              ...node.data.variable,
              value,
            },
          };
        }

        return node;
      }),
    });
    useTabStore.getState().updateFlowTestNodes(get().nodes);
  },
}));

export default useCanvasStore;
