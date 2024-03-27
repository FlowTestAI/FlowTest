import { create } from 'zustand';
import { useTabStore } from './TabStore';

const useEnvStore = create((set, get) => ({
  variables: {},
  setVariables: (variables) => {
    set({ variables });
  },
  handleAddRow: () => {
    set({
      variables: {
        ...get().variables,
        '': '',
      },
    });
    useTabStore.getState().updateEnvTab(get().variables);
  },
  handleKeyChange: ({ newKey, previousKey }) => {
    set({
      variables: Object.keys(get().variables).reduce((newObj, key) => {
        if (key === previousKey) {
          newObj[newKey] = get().variables[key];
        } else {
          newObj[key] = get().variables[key];
        }
        return newObj;
      }, {}),
    });
    useTabStore.getState().updateEnvTab(get().variables);
  },
  handleValueChange: ({ key, newValue }) => {
    set({
      variables: Object.keys(get().variables).reduce((newObj, k) => {
        if (k === key) {
          newObj[k] = newValue;
        } else {
          newObj[k] = get().variables[k];
        }
        return newObj;
      }, {}),
    });
    useTabStore.getState().updateEnvTab(get().variables);
  },
}));

export default useEnvStore;
