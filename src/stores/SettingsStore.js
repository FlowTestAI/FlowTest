import { create } from 'zustand';

const useSettingsStore = create((set, get) => ({
  logSyncConfig: {},
  genAIUsageDisclaimer: false,
  addLogSyncConfig: (enabled, hostUrl, accessId, accessKey) => {
    set((state) => ({ logSyncConfig: { ...state.logSyncConfig, ...{ enabled, hostUrl, accessId, accessKey } } }));
  },
  addGenAIUsageDisclaimer: (accepted) => {
    set((state) => ({ genAIUsageDisclaimer: accepted }));
  },
}));

export default useSettingsStore;
