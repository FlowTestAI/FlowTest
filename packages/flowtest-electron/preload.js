const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, handler) => ipcRenderer.on(channel, (event, ...args) => handler(...args)),
});
