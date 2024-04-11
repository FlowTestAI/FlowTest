import useCollectionStore from '../stores/CollectionStore';
import { v4 as uuidv4 } from 'uuid';
import { findItemInCollectionByPathname } from 'stores/utils';
import { useEventStore } from 'stores/EventListenerStore';
import { OBJ_TYPES } from 'constants/Common';
import { toast } from 'react-toastify';
import { useTabStore } from 'stores/TabStore';
import useCanvasStore from 'stores/CanvasStore';
import { initFlowData } from 'components/molecules/flow/utils';

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
    //toast.error('Error opening collection');
    return Promise.reject(new Error('Error opening collection'));
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
    //toast.error('Error deleting collection');
    return Promise.reject(new Error('Error deleting collection'));
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
    //toast.error('Error creating new folder');
    return Promise.reject(new Error('Error creating new folder'));
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
    console.log(`Error deleting folder: ${error}`);
    //toast.error('Error deleting folder');
    return Promise.reject(new Error('Error deleting folder'));
  }
};

export const createEnvironmentFile = (name, collectionId) => {
  try {
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
            name: `${name}.env`,
          });
        });
      }
    } else {
      return Promise.reject(new Error('Collection not found'));
    }
  } catch (error) {
    //toast.error('Error creating new environment');
    return Promise.reject(new Error('Error creating new environment'));
  }
};

export const readEnvironmentFile = (name, collectionId) => {
  try {
    const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

    if (collection) {
      const existingEnv = collection.environments.find((e) => e.name === name);
      if (existingEnv) {
        useTabStore.getState().addEnvTab(existingEnv, collectionId);
        return;
      } else {
        throw new Error('An environment with the name does not exists');
      }
    } else {
      throw new Error('Collection not found');
    }
  } catch (error) {
    //toast.error(`Error reading environment: ${name}`);
    return Promise.reject(new Error('Error reading environment'));
  }
};

export const updateEnvironmentFile = (name, collectionId, variables) => {
  try {
    const { ipcRenderer } = window;

    const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

    if (collection) {
      const existingEnv = collection.environments.find((e) => e.name === name);
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
  } catch (error) {
    console.log(`Error updating environment: ${error}`);
    //toast.error('Error updating environment');
    return Promise.reject(new Error('Error updating environment'));
  }
};

export const deleteEnvironmentFile = (name, collectionId) => {
  try {
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
  } catch (error) {
    //toast.error('Error deleting environment');
    return Promise.reject(new Error('Error deleting environment'));
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
          ipcRenderer.invoke('renderer:create-flowtest', name, folderPath, initFlowData).then(resolve).catch(reject);
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
    //toast.error('Error creating new flowtest');
    return Promise.reject(new Error('Error creating new flowtest'));
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
    //toast.error('Error reading flowtest');
    return Promise.reject(new Error('Error reading flowtest'));
  }
};

export const readFlowTestSync = (relativePath) => {
  try {
    if (relativePath.trim() != '') {
      const { ipcRenderer } = window;

      // assumes that this function is triggered from graph run
      const collectionId = useCanvasStore.getState().collectionId;
      const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
      if (collection) {
        return new Promise((resolve, reject) => {
          return ipcRenderer
            .invoke('renderer:read-flowtest-sync', ipcRenderer.join(collection.pathname, relativePath))
            .then(resolve)
            .catch(reject);
        });
      }
    }
  } catch (error) {
    console.log(`Error reading flowtest: ${error}`);
    return Promise.reject(new Error('Error reading flowtest'));
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
    //toast.error('Error updating flowtest');
    return Promise.reject(new Error('Error updating flowtest'));
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
    //toast.error('Error deleting flowtest');
    return Promise.reject(new Error('Error deleting flowtest'));
  }
};
