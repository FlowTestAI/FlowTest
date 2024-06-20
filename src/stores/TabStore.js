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
      run: {},
    };

    set((state) => ({ tabs: [...state.tabs, newTab] }));
    set(() => ({ focusTabId: newTab.id }));
  },
  // these state changes are meant to be triggered by canvas in focus
  updateFlowTestNodes: (nodes) => {
    set(
      produce((state) => {
        if (state.focusTabId) {
          const existingTab = state.tabs.find((t) => t.id === state.focusTabId);
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
  // these state changes are meant to be triggered by canvas in focus
  updateFlowTestEdges: (edges) => {
    set(
      produce((state) => {
        if (state.focusTabId) {
          const existingTab = state.tabs.find((t) => t.id === state.focusTabId);
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
  // these state changes are meant to be triggered by canvas in focus
  updateFlowTestViewport: (viewport) => {
    set(
      produce((state) => {
        if (state.focusTabId) {
          const existingTab = state.tabs.find((t) => t.id === state.focusTabId);
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
  updateFlowTestLogs: (tabId, logs, flowScan) => {
    set(
      produce((state) => {
        const existingTab = state.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          existingTab.run = {
            scan: flowScan,
            logs,
          };
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
  // these state changes are meant to be triggered by env tab in focus
  updateEnvTab: (variables) => {
    if (get().focusTabId) {
      const existingTab = get().tabs.find((t) => t.id === get().focusTabId);
      if (existingTab) {
        if (!existingTab.variablesDraft) {
          existingTab.variablesDraft = cloneDeep(existingTab.variables);
        }
        existingTab.variablesDraft = variables;
      }
      console.log(existingTab);
    }
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
