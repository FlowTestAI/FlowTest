const { ipcRenderer, contextBridge } = require('electron');
const path = require('path');
const { isMacOS } = require('./src/utils/filemanager/filesystem');

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, handler) => ipcRenderer.on(channel, (event, ...args) => handler(...args)),
  join: (...args) => path.join(...args),
  relative: (...args) => path.relative(...args),
  dirname: (...args) => path.dirname(...args),
  isMacOs: isMacOS,
});
