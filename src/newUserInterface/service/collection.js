const { default: useCollectionStore } = require('../stores/CollectionStore');

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
    return Promise.reject(new Error('Collection not found'));
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

const createEnvironmentFile = (name, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:create-environment', collection.pathname, name).then(resolve).catch(reject);
    });
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

const updateEnvironmentFile = (name, collectionId, variables) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('renderer:update-environment', collection.pathname, name, variables)
        .then(resolve)
        .catch(reject);
    });
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

const deleteEnvironmentFile = (name, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:delete-environment', collection.pathname, name).then(resolve).catch(reject);
    });
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

const createFlowTest = (name, path, flowData) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:create-flowtest', name, path, flowData).then(resolve).catch(reject);
  });
};

const updateFlowTest = (path, flowData) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:update-flowtest', path, flowData).then(resolve).catch(reject);
  });
};

const deleteFlowTest = (path) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:delete-flowtest', path).then(resolve).catch(reject);
  });
};

module.exports = {
  createCollection,
  deleteCollection,
  createFolder,
  deleteFolder,
  createEnvironmentFile,
  updateEnvironmentFile,
  deleteEnvironmentFile,
  createFlowTest,
  updateFlowTest,
  deleteFlowTest,
};
