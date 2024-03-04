import useCollectionStore from 'stores/CollectionStore';
import { useEffect } from 'react';

const registerMainEventHandlers = () => {
  const _createCollection = useCollectionStore((state) => state.createCollection);
  const _deleteCollection = useCollectionStore((state) => state.deleteCollection);
  const _createFolder = useCollectionStore((state) => state.createFolder);
  const _deleteFolder = useCollectionStore((state) => state.deleteFolder);
  const _addOrUpdateEnvFile = useCollectionStore((state) => state.addOrUpdateEnvFile);
  const _deleteEnvFile = useCollectionStore((state) => state.deleteEnvFile);
  const _addOrUpdateDotEnvVariables = useCollectionStore((state) => state.addOrUpdateDotEnvVariables);
  const _createFlowTest = useCollectionStore((state) => state.createFlowTest);
  const _readFlowTest = useCollectionStore((state) => state.readFlowTest);
  const _updateFlowTest = useCollectionStore((state) => state.updateFlowTest);
  const _deleteFlowTest = useCollectionStore((state) => state.deleteFlowTest);
  const _updateUserSelectedDirectory = useCollectionStore((state) => state.updateUserSelectedDirectory);

  useEffect(() => {
    const { ipcRenderer } = window;

    ipcRenderer.on('main:collection-created', (id, name, pathname, nodes) => {
      _createCollection(id, name, pathname, nodes);
    });

    ipcRenderer.on('main:collection-deleted', (collectionId) => {
      _deleteCollection(collectionId);
    });

    ipcRenderer.on('main:add-directory', (directory, collectionId, subDirsFromRoot, PATH_SEPARATOR) => {
      _createFolder(directory, collectionId, subDirsFromRoot, PATH_SEPARATOR);
    });

    ipcRenderer.on('main:delete-directory', (directory, collectionId) => {
      _deleteFolder(directory, collectionId);
    });

    ipcRenderer.on('main:addOrUpdate-environment', (file, collectionId) => {
      _addOrUpdateEnvFile(file, collectionId);
    });

    ipcRenderer.on('main:delete-environment', (file, collectionId) => {
      _deleteEnvFile(file, collectionId);
    });

    ipcRenderer.on('main:addOrUpdate-dotEnvironment', (variables, collectionId) => {
      _addOrUpdateDotEnvVariables(variables, collectionId);
    });

    ipcRenderer.on('main:create-flowtest', (file, collectionId) => {
      _createFlowTest(file, collectionId);
    });

    ipcRenderer.on('main:read-flowtest', (pathname, collectionId, flowData) => {
      _readFlowTest(pathname, collectionId, flowData);
    });

    ipcRenderer.on('main:update-flowtest', (file, collectionId) => {
      _updateFlowTest(file, collectionId);
    });

    ipcRenderer.on('main:delete-flowtest', (file, collectionId) => {
      _deleteFlowTest(file, collectionId);
    });

    ipcRenderer.invoke('renderer:browser-window-ready');

    ipcRenderer.on('main:user-selected-directory', (path) => {
      _updateUserSelectedDirectory(path);
    });
  }, []);
};

export default registerMainEventHandlers;
