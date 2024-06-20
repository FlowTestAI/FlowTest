import { useEffect } from 'react';
import useSettingsStore from 'stores/SettingsStore';

const registerSettingsEventHandlers = () => {
  const _addLogSyncConfig = useSettingsStore((state) => state.addLogSyncConfig);

  useEffect(() => {
    const { ipcRenderer } = window;

    ipcRenderer.on('main:saved-settings', (savedSettings) => {
      if (savedSettings.logSyncConfig) {
        const config = savedSettings.logSyncConfig;
        _addLogSyncConfig(config.hostUrl || '', config.accessId || '', config.accessKey || '');
      }
    });

    ipcRenderer.invoke('renderer:settings-window-ready');
  }, []);
};

export default registerSettingsEventHandlers;
