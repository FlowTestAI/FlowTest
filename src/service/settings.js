export const addLogSyncConfig = (enabled, hostUrl, accessId, accessKey) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:add-logsyncconfig', { enabled, hostUrl, accessId, accessKey })
      .then(resolve)
      .catch(reject);
  });
};
