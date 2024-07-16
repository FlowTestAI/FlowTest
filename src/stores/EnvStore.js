import { create } from 'zustand';
import { useTabStore } from './TabStore';

const useEnvStore = create((set, get) => ({
  variables: {},
  setVariables: (variables) => {
    set({ variables });
  },
  handleAddVariable: (key, value) => {
    set((state) => ({ variables: { ...state.variables, [key]: value } }));
    useTabStore.getState().updateEnvTab(useTabStore.getState().focusTabId, get().variables);
  },
  handleDeleteVariable: (key) => {
    const { [key]: _, ...newVariables } = get().variables;
    set({ variables: newVariables });
    useTabStore.getState().updateEnvTab(useTabStore.getState().focusTabId, get().variables);
  },
}));

export default useEnvStore;
