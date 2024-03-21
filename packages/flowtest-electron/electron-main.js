// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const Watcher = require('./src/app/watcher');
const registerRendererEventHandlers = require('./src/ipc/collection');

let mainWindow;
let watcher;

app.on('ready', async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
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
