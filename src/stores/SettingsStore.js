import { create } from 'zustand';

const useSettingsStore = create((set, get) => ({
  logSyncConfig: {},
  addLogSyncConfig: (enabled, hostUrl, accessId, accessKey) => {
    set((state) => ({ logSyncConfig: { ...state.logSyncConfig, ...{ enabled, hostUrl, accessId, accessKey } } }));
  },
}));

export default useSettingsStore;
