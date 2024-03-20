import useCollectionStore from '../stores/CollectionStore';
import { v4 as uuidv4 } from 'uuid';
import { findItemInCollectionByPathname } from 'stores/utils';
import { useEventStore } from 'stores/EventListenerStore';
import { OBJ_TYPES } from 'constants/Common';

export const createCollection = (openAPISpecFilePath, collectionFolderPath) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:create-collection', openAPISpecFilePath, collectionFolderPath)
      .then(resolve)
      .catch(reject);
  });
};

export const openCollection = (openAPISpecFilePath, collectionFolderPath) => {
  try {
    const collection = useCollectionStore.getState().collections.find((c) => c.pathname === collectionFolderPath);
    if (collection) {
      return Promise.reject(new Error(`A collection with path: ${collectionFolderPath} already exists`));
    } else {
      const { ipcRenderer } = window;

      return new Promise((resolve, reject) => {
        ipcRenderer
          .invoke('renderer:open-collection', openAPISpecFilePath, collectionFolderPath)
          .then(resolve)
          .catch(reject);
      });
    }
  } catch (error) {
    console.log(`Error opening collection: ${error}`);
    // TODO: show error in UI
  }
};

export const deleteCollection = (collectionId) => {
  try {
    const { ipcRenderer } = window;

    const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

    if (collection) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:delete-collection', collection).then(resolve).catch(reject);
      });
    } else {
      return Promise.reject(new Error('Collection not found'));
    }
  } catch (error) {
    console.log(`Error deleting collection: ${error}`);
    // TODO: show error in UI
  }
};

export const createFolder = (folderName, folderPath, collectionId) => {
  try {
    const { ipcRenderer } = window;

    const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
    if (collection) {
      const folderPathItem = findItemInCollectionByPathname(collection, folderPath);
      const sameFolderExists = folderPathItem.items.find((i) => i.type === OBJ_TYPES.folder && i.name === folderName);
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
  } catch (error) {
    console.log(`Error creating new folder: ${error}`);
    // TODO: show error in UI
  }
};

export const deleteFolder = (folderPath, collectionId) => {
  try {
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
  } catch (error) {
    console.log(`Error deleting new folder: ${error}`);
    // TODO: show error in UI
  }
};

export const createEnvironmentFile = (name, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    const existingEnv = collection.environments.find((e) => e.name === `${name}.env`);
    if (existingEnv) {
      return Promise.reject(new Error('An environment with the same name already exists'));
    } else {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:create-environment', collection.pathname, name).then(resolve).catch(reject);
        useEventStore.getState().addEvent({
          id: uuidv4(),
          type: 'OPEN_NEW_ENVIRONMENT',
          collectionId,
          name,
        });
      });
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const updateEnvironmentFile = (name, collectionId, variables) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    const existingEnv = collection.enviroments.find((e) => e.name === name);
    if (existingEnv) {
      return new Promise((resolve, reject) => {
        ipcRenderer
          .invoke('renderer:update-environment', collection.pathname, name, variables)
          .then(resolve)
          .catch(reject);
      });
    } else {
      return Promise.reject(new Error('An environment with the name does not exists'));
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const deleteEnvironmentFile = (name, collectionId) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    const existingEnv = collection.environments.find((e) => e.name === name);
    if (existingEnv) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('renderer:delete-environment', collection.pathname, name).then(resolve).catch(reject);
      });
    } else {
      return Promise.reject(new Error('An environment with the name does not exists'));
    }
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const addOrUpdateDotEnvironmentFile = (collectionId, variables) => {
  const { ipcRenderer } = window;

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

  if (collection) {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('renderer:addOrUpdate-dotEnvironment', collection.pathname, variables)
        .then(resolve)
        .catch(reject);
    });
  } else {
    return Promise.reject(new Error('Collection not found'));
  }
};

export const createFlowTest = (name, folderPath, collectionId) => {
  try {
    const { ipcRenderer } = window;

    const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
    if (collection) {
      const folderPathItem = findItemInCollectionByPathname(collection, folderPath);
      const sameFlowTestExists = folderPathItem.items.find(
        (i) => i.type === OBJ_TYPES.flowtest && i.name === `${name}.flow`,
      );
      if (sameFlowTestExists) {
        return Promise.reject(new Error('A flowtest with the same name already exists'));
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.invoke('renderer:create-flowtest', name, folderPath).then(resolve).catch(reject);
          useEventStore.getState().addEvent({
            id: uuidv4(),
            type: 'OPEN_NEW_FLOWTEST',
            collectionId,
            name: `${name}.flow`,
            path: folderPath,
          });
        });
      }
    } else {
      return Promise.reject(new Error('Collection not found'));
    }
  } catch (error) {
    console.log(`Error creating new flowtest: ${error}`);
    // TODO: show error in UI
  }
};

export const readFlowTest = (pathname, collectionId) => {
  try {
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
  } catch (error) {
    console.log(`Error reading flowtest: ${error}`);
    // TODO: show error in UI
  }
};

// rename flowtest
// tab id is flowtest id, so when rename event happens
export const updateFlowTest = (pathname, flowData, collectionId) => {
  try {
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
  } catch (error) {
    console.log(`Error updating flowtest: ${error}`);
    // TODO: show error in UI
  }
};

export const deleteFlowTest = (pathname, collectionId) => {
  try {
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
  } catch (error) {
    console.log(`Error deleting flowtest: ${error}`);
    // TODO: show error in UI
  }
};
