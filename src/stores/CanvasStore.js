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

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useCanvasStore = create((set, get) => ({
  nodes: [],
  edges: [],
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
}));

export default useCanvasStore;
