const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, handler) => {
    const subscription = (event, ...args) => handler(...args);
    ipcRenderer.on(channel, subscription);
  },
});
