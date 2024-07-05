import { create } from 'zustand';

const useSettingsStore = create((set, get) => ({
  logSyncConfig: {},
  genAIUsageDisclaimer: false,
  appVersion: {},
  addLogSyncConfig: (enabled, hostUrl, accessId, accessKey) => {
    set((state) => ({ logSyncConfig: { ...state.logSyncConfig, ...{ enabled, hostUrl, accessId, accessKey } } }));
  },
  addGenAIUsageDisclaimer: (accepted) => {
    set((state) => ({ genAIUsageDisclaimer: accepted }));
  },
  updateAppVersion: (version) => {
    set((state) => ({ appVersion: version }));
  },
}));

export default useSettingsStore;
