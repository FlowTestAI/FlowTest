const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ipcMain, shell, dialog, app } = require('electron');
const SwaggerParser = require('@apidevtools/swagger-parser');
const JsonRefs = require('json-refs');
const createDirectory = require('../utils/filemanager/createdirectory');
const deleteDirectory = require('../utils/filemanager/deletedirectory');
const uuidv4 = require('uuid').v4;
const Collections = require('../store/collection');
const { parseOpenAPISpec } = require('../utils/collection');
const { isDirectory, pathExists } = require('../utils/filemanager/filesystem');
const createFile = require('../utils/filemanager/createfile');
const updateFile = require('../utils/filemanager/updatefile');
const deleteFile = require('../utils/filemanager/deletefile');
const readFile = require('../utils/filemanager/readfile');
const FlowtestAI = require('../ai/flowtestai');
const { stringify, parse } = require('flatted');
const { deserialize, serialize } = require('../utils/flowparser/parser');
const { axiosClient } = require('./axiosClient');
const FormData = require('form-data');
const { extend, cloneDeep } = require('lodash');

const collectionStore = new Collections();
const flowTestAI = new FlowtestAI();

const timeout = 60000;

const newAbortSignal = () => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeout || 0);

  return abortController.signal;
};

/** web platform: blob. */
const convertBase64ToBlob = async (base64) => {
  const response = await fetch(base64);
  const blob = await response.blob();
  return blob;
};

const registerRendererEventHandlers = (mainWindow, watcher) => {
  ipcMain.handle('renderer:open-directory-selection-dialog', async (event, arg) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      });
      return result.filePaths[0];
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:browser-window-ready', async (event) => {
    const savedCollections = collectionStore.getAll();

    for (let i = 0; i < savedCollections.length; i++) {
      if (isDirectory(savedCollections[i].pathname)) {
        mainWindow.webContents.send(
          'main:collection-created',
          savedCollections[i].id,
          path.basename(savedCollections[i].pathname),
          savedCollections[i].pathname,
          savedCollections[i].nodes,
        );

        watcher.addWatcher(mainWindow, savedCollections[i].pathname, savedCollections[i].id);
      } else {
        collectionStore.remove(savedCollections[i]);
      }
    }
  });

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
      const pathname = path.join(collectionFolderPath, collectionName);

      const newCollection = {
        id: id,
        name: collectionName,
        pathname: pathname,
        openapi_spec: stringify(resolvedSpec.resolved),
        nodes: parsedNodes,
      };

      const result = createDirectory(newCollection.name, collectionFolderPath);
      console.log(`Created directory: ${result}`);
      createDirectory('environments', pathname);

      mainWindow.webContents.send('main:collection-created', id, path.basename(pathname), pathname, parsedNodes);

      watcher.addWatcher(mainWindow, pathname, id);
      collectionStore.add(newCollection);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:open-collection', async (event, openAPISpecFilePath, collectionFolderPath) => {
    try {
      if (isDirectory(collectionFolderPath)) {
        // async/await syntax
        const api = await SwaggerParser.validate(openAPISpecFilePath);
        // console.log("API name: %s, Version: %s", api.info.title, api.info.version);

        // resolve references in openapi spec
        const resolvedSpec = await JsonRefs.resolveRefs(api);
        const parsedNodes = parseOpenAPISpec(resolvedSpec.resolved);

        const id = uuidv4();
        const collectionName = api.info.title;

        const newCollection = {
          id: id,
          name: collectionName,
          pathname: collectionFolderPath,
          openapi_spec: stringify(resolvedSpec.resolved),
          nodes: parsedNodes,
        };

        mainWindow.webContents.send('main:collection-created', id, collectionName, collectionFolderPath, parsedNodes);

        watcher.addWatcher(mainWindow, collectionFolderPath, id);
        collectionStore.add(newCollection);
      } else {
        return Promise.reject(new Error(`Directory: ${collectionFolderPath} does not exist`));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:delete-collection', async (event, collection) => {
    try {
      // deleteDirectory(collection.pathname);
      // console.log(`Deleted directory: ${collection.pathname}`);

      mainWindow.webContents.send('main:collection-deleted', collection.id);

      watcher.removeWatcher(collection.pathname);
      collectionStore.remove(collection);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:create-folder', async (event, name, path) => {
    try {
      const result = createDirectory(name, path);
      console.log(`Created directory: ${result}`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:delete-folder', async (event, path) => {
    try {
      const result = deleteDirectory(path);
      console.log(`Deleted directory: ${path}`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:create-environment', async (event, collectionPath, name) => {
    try {
      const envDir = path.join(collectionPath, 'environments');
      if (!isDirectory(envDir)) {
        createDirectory('environments', collectionPath);
      }
      const result = createFile(`${name}.env`, envDir, '');
      console.log(`Created file: ${name}.env`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:update-environment', async (event, collectionPath, name, variables) => {
    try {
      const env = Object.entries(variables)
        .map(([key, value]) => `${key}: "${value}"`)
        .join('\n');
      const envDir = path.join(collectionPath, 'environments');
      updateFile(path.join(envDir, name), env);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:delete-environment', async (event, collectionPath, name) => {
    try {
      const envDir = path.join(collectionPath, 'environments');
      deleteFile(path.join(envDir, name));
      console.log(`Delete file: ${name}`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:create-dotenv', async (event, collectionPath, content) => {
    try {
      createFile('.env', collectionPath, content || '');
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:addOrUpdate-dotEnvironment', async (event, collectionPath, variables) => {
    try {
      const pathname = path.join(collectionPath, '.env');
      // variables should be of format `k1=v1\nk2=v2`;

      updateFile(pathname, variables);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:create-flowtest', async (event, name, path, flowData) => {
    try {
      if (isDirectory(path)) {
        const textData = deserialize(flowData);
        createFile(`${name}.flow`, path, JSON.stringify(textData, null, 4));
        console.log(`Created file: ${name}.flow`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:clone-flowtest', async (event, name, flowtestPath) => {
    try {
      const content = readFile(flowtestPath);
      createFile(`${name}.flow`, path.dirname(flowtestPath), content);
      console.log(`Cloned file: ${name}.flow`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:read-flowtest', async (event, pathname, collectionId) => {
    try {
      const content = readFile(pathname);
      const flowData = serialize(JSON.parse(content));
      mainWindow.webContents.send('main:read-flowtest', pathname, collectionId, flowData);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:read-flowtest-sync', (event, pathname) => {
    const content = readFile(pathname);
    const flowData = serialize(JSON.parse(content));
    return flowData;
  });

  ipcMain.handle('renderer:update-flowtest', async (event, pathname, flowData) => {
    try {
      const textData = deserialize(flowData);
      updateFile(pathname, JSON.stringify(textData, null, 4));
      console.log(`Updated file: ${pathname}`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:delete-flowtest', async (event, pathname) => {
    try {
      deleteFile(pathname);
      console.log(`Delete file: ${pathname}`);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:run-http-request', async (event, request, collectionPath) => {
    let requestSent;
    try {
      if (request.headers['content-type'] === 'multipart/form-data') {
        const formData = new FormData();
        const params = request.data;
        await params.map(async (param, index) => {
          if (param.type === 'text') {
            formData.append(param.key, param.value);
          }

          if (param.type === 'file') {
            let trimmedFilePath = param.value.trim();

            if (!path.isAbsolute(trimmedFilePath)) {
              trimmedFilePath = path.join(collectionPath, trimmedFilePath);
            }

            formData.append(param.key, fs.createReadStream(trimmedFilePath), path.basename(trimmedFilePath));
          }
        });

        request.data = formData;
        extend(request.headers, formData.getHeaders());
      }

      requestSent = {
        url: request.url,
        method: request.method,
        headers: request.headers,
        // form data obj gets serialized here so that it can be sent over wire
        // otherwise ipc communication errors out
        data: JSON.parse(JSON.stringify(request.data)),
      };

      const result = await axios({
        ...request,
        signal: newAbortSignal(),
      });

      return {
        request: requestSent,
        response: {
          status: result.status,
          statusText: result.statusText,
          data: result.data,
          headers: result.headers,
        },
      };
    } catch (error) {
      if (error?.response) {
        return {
          request: requestSent,
          response: {
            error: {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
              headers: error.response.headers,
            },
          },
        };
      } else {
        return {
          request: requestSent,
          response: {
            error: {
              status: '',
              statusText: '',
              data: `An error occurred while running the request : ${error?.message}`,
            },
          },
        };
      }
    }
  });

  ipcMain.handle('renderer:generate-nodes-ai', async (event, instruction, collectionId, model) => {
    try {
      const collection = collectionStore.getAll().find((c) => c.id === collectionId);
      if (collection) {
        return await flowTestAI.generate(parse(collection.openapi_spec), instruction, model);
      } else {
        return Promise.reject(new Error('Collection not found'));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  });

  ipcMain.handle('renderer:upload-logs', async (event, name, config, status, time, logs) => {
    function bytesToBase64(bytes) {
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
      return btoa(binString);
    }

    try {
      const data = {
        scan_metadata: {
          version: 1,
          name,
          status,
          time,
        },
        scan: bytesToBase64(new TextEncoder().encode(JSON.stringify(logs))),
      };
      try {
        const response = await axiosClient(config.hostUrl, config.accessId, config.accessKey).post('/upload', data);
        return {
          upload: 'success',
          url: `${config.hostUrl}/scan/${response.data.data[0].id}`,
        };
      } catch (error) {
        if (error?.response) {
          if (error.response?.status >= 400 && error.response?.status < 500) {
            return {
              upload: 'fail',
              message: 'Unable to upload flow scan',
              reason: `${JSON.stringify(error.response?.data)}`,
            };
          }

          if (error.response?.status === 500) {
            return {
              upload: 'fail',
              message: 'Unable to upload flow scan',
              reason: 'Internal Server Error',
            };
          }
        }
        return {
          upload: 'fail',
          message: 'Unable to upload flow scan',
        };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

module.exports = registerRendererEventHandlers;
