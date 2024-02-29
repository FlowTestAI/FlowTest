import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { findItemInCollectionTree, deleteItemInCollectionByPathname, findItemInCollectionByPathname } from './utils.js';
import { useEventStore, _removeEvent } from './EventListenerStore.js';
import { useTabStore, _addFlowTestTab, _closeFlowTestTab } from './TabStore.js';

const useCollectionStore = create((set, get) => ({
  collections: [],
  createCollection: (id, name, pathname, nodes) => {
    const collectionObj = {
      version: '1',
      id: id,
      name: name,
      pathname: pathname,
      nodes: nodes,
      items: [],
      enviroments: [],
    };
    if (!get().collections.find((c) => c.pathname === pathname)) {
      set((state) => ({ collections: [...state.collections, collectionObj] }));
      console.log(`Collection added: ${JSON.stringify(get().collections)}`);
    }
  },
  deleteCollection(collectionId) {
    set((state) => ({ collections: state.collections.filter((c) => c.id != collectionId) }));
    console.log(`Collection removed: ${JSON.stringify(get().collections)}`);
  },
  createFolder: (directory, collectionId, subDirsFromRoot, PATH_SEPARATOR) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      let currentPath = collection.pathname;
      let currentSubItems = collection.items;
      for (const directoryName of subDirsFromRoot) {
        let childItem = currentSubItems.find((f) => f.type === 'folder' && f.name === directoryName);
        if (!childItem) {
          childItem = {
            id: uuidv4(),
            pathname: `${currentPath}${PATH_SEPARATOR}${directoryName}`,
            name: directoryName,
            type: 'folder',
            items: [],
          };
          currentSubItems.push(childItem);
        }

        currentPath = `${currentPath}${PATH_SEPARATOR}${directoryName}`;
        currentSubItems = childItem.items;
      }

      console.log(`Collection folder created: ${JSON.stringify(get().collections)}`);
    }
  },
  deleteFolder: (directory, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      // if it's the collection itself
      if (collection.pathname === directory.pathname && collection.name === directory.name) {
        get().deleteCollection(collection.id);
      } else {
        const item = findItemInCollectionTree(directory, collection);

        if (item) {
          deleteItemInCollectionByPathname(item.pathname, collection);
          console.log(`Collection folder deleted: ${JSON.stringify(get().collections)}`);
        }
      }
    }
  },
  addOrUpdateEnvFile: (file, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      const existingEnv = collection.enviroments.find((e) => e.name === file.name && e.pathname === file.pathname);
      if (existingEnv) {
        existingEnv.modifiedAt = Date.now();
        existingEnv.variables = file.variables;
        console.log(`Collection env updated: ${JSON.stringify(collection)}`);
      } else {
        const timestamp = Date.now();
        collection.enviroments.push({
          id: uuidv4(),
          createdAt: timestamp,
          modifiedAt: timestamp,
          ...file,
        });
        console.log(`Collection env added: ${JSON.stringify(collection)}`);
      }
    }
  },
  deleteEnvFile: (file, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection && collection.enviroments) {
      collection.enviroments = collection.enviroments.filter(
        (e) => e.name !== file.name && e.pathname !== file.pathname,
      );
      console.log(`Collection updated: ${JSON.stringify(collection)}`);
    }
  },
  addOrUpdateDotEnvVariables: (variables, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      collection.dotEnvVariables = variables;
      console.log(`Collection dotenv variables added/updated: ${JSON.stringify(collection)}`);
    }
  },
  createFlowTest: (file, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      const PATH_SEPARATOR = file.sep;
      let currentPath = collection.pathname;
      let currentSubItems = collection.items;
      for (const directoryName of file.subDirectories) {
        let childItem = currentSubItems.find((f) => f.type === 'folder' && f.name === directoryName);
        if (!childItem) {
          childItem = {
            id: uuidv4(),
            pathname: `${currentPath}${PATH_SEPARATOR}${directoryName}`,
            name: directoryName,
            type: 'folder',
            items: [],
          };
          currentSubItems.push(childItem);
        }

        currentPath = `${currentPath}${PATH_SEPARATOR}${directoryName}`;
        currentSubItems = childItem.items;
      }

      if (!currentSubItems.find((f) => f.name === file.name)) {
        const timestamp = Date.now();
        const flowtest = {
          id: uuidv4(),
          createdAt: timestamp,
          modifiedAt: timestamp,
          name: file.name,
          pathname: file.pathname,
        };
        currentSubItems.push(flowtest);
        console.log(`Collection updated: ${JSON.stringify(collection)}`);

        // check if there are any open tab requests
        const event = useEventStore
          .getState()
          .events.find(
            (e) =>
              e.type === 'OPEN_NEW_FLOWTEST' &&
              e.collectionId === collectionId &&
              e.name === file.name &&
              e.path === currentPath,
          );
        if (event) {
          _addFlowTestTab(flowtest, collectionId);
          _removeEvent(event.id);
        }
      }
    }
  },
  readFlowTest: (pathname, collectionId, flowData) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      const item = findItemInCollectionByPathname(pathname);

      if (item) {
        // check if there are any open tab requests
        const event = useEventStore
          .getState()
          .events.find(
            (e) =>
              e.type === 'OPEN_SAVED_FLOWTEST' &&
              e.collectionId === collectionId &&
              e.name === item.name &&
              e.pathname === item.pathname,
          );
        if (event) {
          _addFlowTestTab(
            {
              ...item,
              flowData,
            },
            collectionId,
          );
          _removeEvent(event.id);
        }
      }
    }
  },
  updateFlowTest: (file, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      const item = findItemInCollectionTree(file, collection);

      if (item) {
        item.modifiedAt = Date.now();
        console.log(`Collection updated: ${JSON.stringify(collection)}`);

        // check if there are any open tabs, if yes mark them saved
        const tab = useTabStore.getState().tabs.find((t) => t.id === item.id);
        if (tab) {
          tab.isDirty = false;
        }
      }
    }
  },
  deleteFlowTest: (file, collectionId) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      const item = findItemInCollectionTree(file, collection);

      if (item) {
        deleteItemInCollectionByPathname(item.pathname, collection);
        console.log(`Collection updated: ${JSON.stringify(collection)}`);

        // remove any open tab of this flowtest
        _closeFlowTestTab(item.id, collectionId);
      }
    }
  },
}));

export default useCollectionStore;
