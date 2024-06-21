const { ipcMain, shell, dialog, app } = require('electron');
const Settings = require('../store/settings');

const settingsStore = new Settings();

const registerSettingsEventHandlers = (mainWindow) => {
  ipcMain.handle('renderer:settings-window-ready', async (event) => {
    const savedSettings = settingsStore.getAll();

    mainWindow.webContents.send('main:saved-settings', savedSettings);
  });

  ipcMain.handle('renderer:add-logsyncconfig', async (event, config) => {
    try {
      settingsStore.addLogSyncConfig(...config);
      const savedSettings = settingsStore.getAll();

      mainWindow.webContents.send('main:saved-settings', savedSettings);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:add-genAIUsageDisclaimer', async (event, accepted) => {
    try {
      settingsStore.addGenAIUsageDisclaimer(accepted);
      const savedSettings = settingsStore.getAll();

      mainWindow.webContents.send('main:saved-settings', savedSettings);
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

module.exports = registerSettingsEventHandlers;
