import { create } from 'zustand';

// id of the tab should be id of collection structure item
// save draft in collection state item
// create a file then intercept the event and open the tab
export const useTabStore = create((set, get) => ({
  tabs: [],
  focusTabId: null,
  addFlowTestTab: (flowtest, collectionId) => {
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
  closeFlowTestTab: (id, collectionId) => {
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
  setFocusTab: (id) => {
    set(() => ({ focusTabId: id }));
  },
}));

export const _addFlowTestTab = useTabStore((state) => state.addFlowTestTab);
export const _closeFlowTestTab = useTabStore((state) => state.closeFlowTestTab);
