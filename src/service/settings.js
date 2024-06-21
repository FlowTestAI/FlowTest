export const addLogSyncConfig = (enabled, hostUrl, accessId, accessKey) => {
  try {
    const { ipcRenderer } = window;

    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('renderer:add-logsyncconfig', { enabled, hostUrl, accessId, accessKey })
        .then(resolve)
        .catch(reject);
    });
  } catch (error) {
    return Promise.reject(new Error('Unable to update config'));
  }
};

export const addGenAIUsageDisclaimer = (accepted) => {
  try {
    const { ipcRenderer } = window;

    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:add-genAIUsageDisclaimer', accepted).then(resolve).catch(reject);
    });
  } catch (error) {
    return Promise.reject(new Error('Unable to acknowledge'));
  }
};
