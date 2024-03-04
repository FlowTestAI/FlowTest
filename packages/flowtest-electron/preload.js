const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, handler) => ipcRenderer.on(channel, (event, ...args) => handler(...args)),
});

process.once('loaded', () => {
  window.addEventListener('message', (evt) => {
    if (evt.data.type === 'open-directory-selection-dialog') {
      ipcRenderer.send('main:open-directory-selection-dialog');
    }
  });
});
