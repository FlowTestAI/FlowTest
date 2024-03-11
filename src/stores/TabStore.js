import { create } from 'zustand';

export const useTabStore = create((set, get) => ({
  tabs: [
    {
      id: '1',
      collectionId: '1eb5becb-e27a-4197-8dd0-358000b3ede3',
      type: 'flowtest',
      name: 'flowtest1',
      pathname: 'flowtest.pathname1',
      isDirty: false,
      flowData: 'THIS IS FLOW TEST 1',
    },
    {
      id: '2',
      collectionId: '1eb5becb-e27a-4197-8dd0-358000b3ede3',
      type: 'flowtest',
      name: 'flowtest2',
      pathname: 'flowtest.pathname2',
      isDirty: false,
      flowData: 'THIS IS FLOW TEST 2',
    },
    {
      id: '3',
      collectionId: '1eb5becb-e27a-4197-8dd0-358000b3ede3',
      type: 'flowtest',
      name: 'flowtest3',
      pathname: 'flowtest.pathname3',
      isDirty: false,
      flowData: 'THIS IS FLOW TEST 3',
    },
  ],
  focusTabId: null,
  addFlowTestTab: (flowtest, collectionId) => {
    const existingTab = get().tabs.find(
      (t) =>
        t.id === flowtest.id &&
        t.name === flowtest.name &&
        t.pathname === flowtest.pathname &&
        t.collectionId === collectionId &&
        t.type === 'flowtest',
    );
    if (existingTab) {
      set(() => ({ focusTabId: existingTab.id }));
      return;
    }
    const newTab = {
      id: flowtest.id,
      collectionId: collectionId,
      type: 'flowtest',
      name: flowtest.name,
      pathname: flowtest.pathname,
      isDirty: false,
      flowData: flowtest.flowData ? flowtest.flowData : undefined,
    };

    set((state) => ({ tabs: [...state.tabs, newTab] }));
    set(() => ({ focusTabId: newTab.id }));
  },
  addEnvTab: (env, collectionId) => {
    const newTab = {
      id: env.id,
      collectionId: collectionId,
      type: 'environment',
      name: env.name,
    };

    set((state) => ({ tabs: [...state.tabs, newTab] }));
    set(() => ({ focusTabId: newTab.id }));
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
}));
