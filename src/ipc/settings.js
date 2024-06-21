import { useEffect } from 'react';
import useSettingsStore from 'stores/SettingsStore';

const registerSettingsEventHandlers = () => {
  const _addLogSyncConfig = useSettingsStore((state) => state.addLogSyncConfig);
  const _addGenAIUsageDisclaimer = useSettingsStore((state) => state.addGenAIUsageDisclaimer);

  useEffect(() => {
    const { ipcRenderer } = window;

    ipcRenderer.on('main:saved-settings', (savedSettings) => {
      if (savedSettings.logSyncConfig) {
        const config = savedSettings.logSyncConfig;
        _addLogSyncConfig(config.enabled || false, config.hostUrl || '', config.accessId || '', config.accessKey || '');
      }

      if (savedSettings.genAIUsageDisclaimer) {
        _addGenAIUsageDisclaimer(savedSettings.genAIUsageDisclaimer);
      }
    });

    ipcRenderer.invoke('renderer:settings-window-ready');
  }, []);
};

export default registerSettingsEventHandlers;
