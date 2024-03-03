import useCollectionStore from '../stores/CollectionStore';
import { v4 as uuidv4 } from 'uuid';
import { findItemInCollectionByPathname } from 'stores/utils';
import { useEventStore } from 'stores/EventListenerStore';

export const createCollection = (openAPISpecFilePath, collectionFolderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:create-collection', openAPISpecFilePath, collectionFolderPath)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteCollection = (collectionId) => {
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

export const createFolder = (folderName, folderPath, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  if (collection) {
    const folderPathItem = findItemInCollectionByPathname(collection, folderPath);
    const sameFolderExists = folderPathItem.items.find((i) => i.type === 'folder' && i.name === folderName);
    if (sameFolderExists) {
      return Promise.reject(new Error('A folder with the same name already exists'));
    } else {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:create-folder', folderName, folderPath).then(resolve).catch(reject);
      });
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const deleteFolder = (folderPath, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  if (collection) {
    const folderPathItem = findItemInCollectionByPathname(collection, folderPath);
    if (folderPathItem) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:delete-folder', folderPath).then(resolve).catch(reject);
      });
    } else {
      return Promise.reject(new Error('Folder with the given path does not exist'));
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const createEnvironmentFile = (name, collectionId) => {
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

export const updateEnvironmentFile = (name, collectionId, variables) => {
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

export const deleteEnvironmentFile = (name, collectionId) => {
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

export const createFlowTest = (name, folderPath, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  if (collection) {
    const folderPathItem = findItemInCollectionByPathname(collection, folderPath);
    const sameFlowTestExists = folderPathItem.items.find((i) => i.type !== 'folder' && i.name === name);
    if (sameFlowTestExists) {
      return Promise.reject(new Error('A flowtest with the same name already exists'));
    } else {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:create-flowtest', name, folderPath).then(resolve).catch(reject);
        useEventStore.getState().addEvent({
          id: uuidv4(),
          type: 'OPEN_NEW_FLOWTEST',
          collectionId,
          name,
          path: folderPath,
        });
      });
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const readFlowTest = (pathname, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  if (collection) {
    const flowtest = findItemInCollectionByPathname(collection, pathname);
    if (flowtest) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:read-flowtest', pathname, collectionId).then(resolve).catch(reject);
        useEventStore.getState().addEvent({
          id: uuidv4(),
          type: 'OPEN_SAVED_FLOWTEST',
          collectionId,
          name: flowtest.name,
          pathname: flowtest.pathname,
        });
      });
    } else {
      return Promise.reject(new Error('A flowtest with this path does not exist'));
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

// rename flowtest
// tab id is flowtest id, so when rename event happens

export const updateFlowTest = (pathname, flowData, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  if (collection) {
    const flowtest = findItemInCollectionByPathname(collection, pathname);
    if (flowtest) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:update-flowtest', pathname, flowData).then(resolve).catch(reject);
      });
    } else {
      return Promise.reject(new Error('A flowtest with this path does not exist'));
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const deleteFlowTest = (pathname, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  if (collection) {
    const flowtest = findItemInCollectionByPathname(collection, pathname);
    if (flowtest) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:delete-flowtest', pathname).then(resolve).catch(reject);
      });
    } else {
      return Promise.reject(new Error('A flowtest with this path does not exist'));
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};
