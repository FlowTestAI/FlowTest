const fs = require('fs');
const path = require('path');
const { ipcMain, shell, dialog, app } = require('electron');
const SwaggerParser = require('@apidevtools/swagger-parser');
const JsonRefs = require('json-refs');
const createDirectory = require('../utils/filemanager/createdirectory');
const { concatRoute } = require('../utils/filemanager/filesystem');
const uuidv4 = require('uuid').v4;
const Collections = require('../store/collection');
const parseOpenAPISpec = require('../utils/collection');

const collectionStore = new Collections();

const registerRendererEventHandlers = (mainWindow, watcher) => {
  ipcMain.handle('renderer:create-collection', async (event, openAPISpecFilePath, collectionFolderPath) => {
    try {
      const spec = fs.readFileSync(openAPISpecFilePath, 'utf8');
      // async/await syntax
      let api = await SwaggerParser.validate(openAPISpecFilePath);
      // console.log("API name: %s, Version: %s", api.info.title, api.info.version);

      // resolve references in openapi spec
      const resolvedSpec = await JsonRefs.resolveRefs(api);
      const parsedNodes = parseOpenAPISpec(resolvedSpec.resolved);

      const id = uuidv4();
      const collectionName = api.info.title;
      const pathname = concatRoute(collectionFolderPath, collectionName);

      const newCollection = {
        id: id,
        name: collectionName,
        pathname: pathname,
        collection: spec,
        nodes: JSON.stringify(parsedNodes),
      };

      const result = createDirectory(newCollection.name, collectionFolderPath);
      console.log(`Created directory: ${result}`);
      createDirectory('environments', pathname);

      mainWindow.webContents.send('main:collection-created', '1', 'success');

      watcher.addWatcher(mainWindow, pathname, id);
      collectionStore.add(newCollection);
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

module.exports = registerRendererEventHandlers;
