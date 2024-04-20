const { shell } = require('electron');

const template = [
  {
    label: 'FlowTestAI',
    submenu: [
      { type: 'separator' },
      {
        role: 'quit',
        label: 'Exit FlowTestAI',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close', accelerator: 'CommandOrControl+Shift+Q' }],
  },
  {
    role: 'help',
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: async () => {
          await shell.openExternal('https://github.com/FlowTestAI/FlowTest');
        },
      },
    ],
  },
];

module.exports = template;
