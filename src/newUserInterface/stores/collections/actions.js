const createCollection = (openAPISpecFilePath, collectionFolderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:create-collection', openAPISpecFilePath, collectionFolderPath)
      .then(resolve)
      .catch(reject);
  });
};

const createFolder = (folderName, folderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:create-folder', folderName, folderPath).then(resolve).catch(reject);
  });
};

module.exports = {
  createCollection,
  createFolder,
};
