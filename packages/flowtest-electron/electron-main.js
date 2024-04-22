// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const url = require('url');
const template = require('./electron-menu');
const Watcher = require('./src/app/watcher');
const registerRendererEventHandlers = require('./src/ipc/collection');

let mainWindow;
let watcher;

if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.error = noop;
  console.warn = noop;
  console.debug = noop;
  console.trace = noop;
}

app.on('ready', async () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    icon: path.join(__dirname, 'assets/MyIcon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
    title: 'FlowTestAI',
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  const startUrl = url.format({
    pathname: path.join(__dirname, '../../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // This is required to open a link in the external browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  watcher = new Watcher();

  registerRendererEventHandlers(mainWindow, watcher);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin')
  app.quit();
});
