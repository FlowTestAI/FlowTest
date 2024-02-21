const { default: useCollectionStore } = require('.');

const createCollection = (openAPISpecFilePath, collectionFolderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:create-collection', openAPISpecFilePath, collectionFolderPath)
      .then(resolve)
      .catch(reject);
  });
};

const deleteCollection = (collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:delete-collection', collection).then(resolve).catch(reject);
    });
  } else {
    return Promise.resolve();
  }
};

const createFolder = (folderName, folderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:create-folder', folderName, folderPath).then(resolve).catch(reject);
  });
};

const deleteFolder = (folderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:delete-folder', folderPath).then(resolve).catch(reject);
  });
};

module.exports = {
  createCollection,
  createFolder,
  deleteFolder,
};
