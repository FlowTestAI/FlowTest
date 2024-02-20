const fs = require('fs');
const path = require('path');
const { ipcMain, shell, dialog, app } = require('electron');
const SwaggerParser = require('@apidevtools/swagger-parser');
const JsonRefs = require('json-refs');
const { default: parseOpenAPISpec } = require('../utils/collection');
const createDirectory = require('../utils/filemanager/createdirectory');
const { concatRoute } = require('../utils/filemanager/filesystem');
import { v4 as uuidv4 } from 'uuid';

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
        name: collectionName,
        collection: spec,
        nodes: JSON.stringify(parsedNodes),
        pathname: pathname,
      };

      createDirectory(newCollection.name, newCollection.pathname);

      createDirectory('environments', pathname);

      watcher.addWatcher(mainWindow, pathname, id);
      // store newCollection in electron persistent store
      //lastOpenedCollections.add(pathname);

      //mainWindow.webContents.send('main:collection-opened', dirPath, uid, brunoConfig);
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

module.exports = registerRendererEventHandlers;
