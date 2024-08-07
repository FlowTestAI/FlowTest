import { OBJ_TYPES } from 'constants/Common';
import { cloneDeep } from 'lodash';
import { create } from 'zustand';
import { produce } from 'immer';

export const useTabStore = create((set, get) => ({
  tabs: [],
  focusTabId: null,
  selectedEnv: null,
  addFlowTestTab: (flowtest, collectionId) => {
    const existingTab = get().tabs.find(
      (t) =>
        t.id === flowtest.id &&
        t.name === flowtest.name &&
        t.pathname === flowtest.pathname &&
        t.collectionId === collectionId &&
        t.type === OBJ_TYPES.flowtest,
    );
    if (existingTab) {
      set(() => ({ focusTabId: existingTab.id }));
      return;
    }
    const newTab = {
      id: flowtest.id,
      collectionId: collectionId,
      type: OBJ_TYPES.flowtest,
      name: flowtest.name,
      pathname: flowtest.pathname,
      flowData: flowtest.flowData,
      running: false,
      run: {},
    };

    set((state) => ({ tabs: [...state.tabs, newTab] }));
    set(() => ({ focusTabId: newTab.id }));
  },
  saveFlowTestTab: (tab, updatedFlowData) => {
    set(
      produce((state) => {
        const existingTab = state.tabs.find(
          (t) =>
            t.id === tab.id &&
            t.name === tab.name &&
            t.pathname === tab.pathname &&
            t.collectionId === tab.collectionId &&
            tab.type === OBJ_TYPES.flowtest,
        );
        if (existingTab) {
          existingTab.flowData = updatedFlowData;
          existingTab.flowDataDraft = null;
        }
      }),
    );
  },
  updateFlowTestNodes: (tabId, nodes) => {
    set(
      produce((state) => {
        if (tabId) {
          const existingTab = state.tabs.find((t) => t.id === tabId);
          if (existingTab) {
            if (!existingTab.flowDataDraft) {
              existingTab.flowDataDraft = existingTab.flowData ? cloneDeep(existingTab.flowData) : {};
            }
            existingTab.flowDataDraft.nodes = nodes;
          }
        }
      }),
    );
  },
  updateFlowTestNode: (tabId, updatedNode) => {
    set(
      produce((state) => {
        if (tabId) {
          const existingTab = state.tabs.find((t) => t.id === tabId);
          if (existingTab) {
            if (!existingTab.flowDataDraft) {
              existingTab.flowDataDraft = existingTab.flowData ? cloneDeep(existingTab.flowData) : {};
            }
            existingTab.flowDataDraft.nodes = existingTab.flowDataDraft.nodes.map((node, index) => {
              if (node.id === updatedNode.id) {
                return updatedNode;
              }
              return node;
            });
          }
        }
      }),
    );
  },
  updateFlowTestEdges: (tabId, edges) => {
    set(
      produce((state) => {
        if (tabId) {
          const existingTab = state.tabs.find((t) => t.id === tabId);
          if (existingTab) {
            if (!existingTab.flowDataDraft) {
              existingTab.flowDataDraft = existingTab.flowData ? cloneDeep(existingTab.flowData) : {};
            }
            existingTab.flowDataDraft.edges = edges;
          }
        }
      }),
    );
  },
  updateFlowTestViewport: (tabId, viewport) => {
    set(
      produce((state) => {
        if (tabId) {
          const existingTab = state.tabs.find((t) => t.id === tabId);
          if (existingTab) {
            if (!existingTab.flowDataDraft) {
              existingTab.flowDataDraft = existingTab.flowData ? cloneDeep(existingTab.flowData) : {};
            }
            existingTab.flowDataDraft.viewport = viewport;
          }
        }
      }),
    );
  },
  updateFlowTestLogs: (tabId, status, logs, flowScan) => {
    set(
      produce((state) => {
        const existingTab = state.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          existingTab.run = {
            status,
            scan: flowScan,
            logs,
          };
        }
      }),
    );
  },
  updateFlowTestRunStatus: (tabId, running) => {
    set(
      produce((state) => {
        const existingTab = state.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          existingTab.running = running;
        }
      }),
    );
  },
  addEnvTab: (env, collectionId) => {
    const existingTab = get().tabs.find(
      (t) =>
        t.id === env.id && t.name === env.name && t.collectionId === collectionId && t.type === OBJ_TYPES.environment,
    );
    if (existingTab) {
      set(() => ({ focusTabId: existingTab.id }));
      return;
    }

    const newTab = {
      id: env.id,
      collectionId: collectionId,
      type: OBJ_TYPES.environment,
      name: env.name,
      variables: env.variables,
    };

    set((state) => ({ tabs: [...state.tabs, newTab] }));
    set(() => ({ focusTabId: newTab.id }));
  },
  updateEnvTab: (tabId, variables) => {
    set(
      produce((state) => {
        if (tabId) {
          const existingTab = state.tabs.find((t) => t.id === tabId);
          if (existingTab) {
            if (!existingTab.variablesDraft) {
              existingTab.variablesDraft = cloneDeep(existingTab.variables);
            }
            existingTab.variablesDraft = variables;
          }
        }
      }),
    );
  },
  saveEnvTab: (tab, variables) => {
    set(
      produce((state) => {
        const existingTab = state.tabs.find(
          (t) => t.id === tab.id && t.name === tab.name && t.type === OBJ_TYPES.environment,
        );
        if (existingTab) {
          existingTab.variables = variables;
          existingTab.variablesDraft = null;
        }
      }),
    );
  },
  closeTab: (id, collectionId) => {
    set((state) => ({ tabs: state.tabs.filter((t) => t.id !== id) }));
    if (get().focusTabId === id) {
      const tabs = get().tabs;
      if (tabs && tabs.length) {
        const collectionTabs = tabs.filter((t) => t.collectionId === collectionId);
        if (collectionTabs && collectionTabs.length) {
          set(() => ({ focusTabId: collectionTabs.slice(-1)[0].id }));
        } else {
          set(() => ({ focusTabId: tabs.slice(-1)[0].id }));
        }
      } else {
        set(() => ({ focusTabId: null }));
      }
    }
  },
  closeTabs: (ids, collectionId) => {
    set((state) => ({ tabs: state.tabs.filter((t) => !ids.includes(t.id)) }));
    if (ids.includes(get().focusTabId)) {
      const tabs = get().tabs;
      if (tabs && tabs.length) {
        const collectionTabs = tabs.filter((t) => t.collectionId === collectionId);
        if (collectionTabs && collectionTabs.length) {
          set(() => ({ focusTabId: collectionTabs.slice(-1)[0].id }));
        } else {
          set(() => ({ focusTabId: tabs.slice(-1)[0].id }));
        }
      } else {
        set(() => ({ focusTabId: null }));
      }
    }
  },
  closeCollectionTabs: (collectionId) => {
    set((state) => ({ tabs: state.tabs.filter((t) => t.collectionId != collectionId) }));
    const tabs = get().tabs;
    if (tabs && tabs.length) {
      set(() => ({ focusTabId: tabs.slice(-1)[0].id }));
    } else {
      set(() => ({ focusTabId: null }));
    }
  },
  setFocusTab: (id) => {
    set(() => ({ focusTabId: id }));
  },
  setSelectedEnv: (name) => {
    set(() => ({ selectedEnv: name }));
  },
}));
