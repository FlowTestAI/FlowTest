import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useCollectionStore = create((set, get) => ({
  collections: [],
  createCollection: (id, name, pathname) => {
    const collectionObj = {
      version: '1',
      id: id,
      name: name,
      pathname: pathname,
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
        currentSubItems.push({
          id: uuidv4(),
          createdAt: timestamp,
          modifiedAt: timestamp,
          name: file.name,
          pathname: file.pathname,
        });
        console.log(`Collection updated: ${JSON.stringify(collection)}`);
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
      }
    }
  },
}));

const findItemInCollectionTree = (item, collection) => {
  let flattenedItems = flattenItems(collection.items);

  return flattenedItems.find((i) => i.pathname === item.pathname && i.name === item.name);
};

const deleteItemInCollectionByPathname = (pathname, collection) => {
  collection.items = collection.items.filter((i) => i.pathname !== pathname);

  let flattenedItems = flattenItems(collection.items);
  flattenedItems.forEach((i) => {
    if (i.items && i.items.length) {
      i.items = i.items.filter((i) => i.pathname !== pathname);
    }
  });
};

const flattenItems = (items = []) => {
  const flattenedItems = [];

  const flatten = (itms, flattened) => {
    itms.forEach((i) => {
      flattened.push(i);

      if (i.items && i.items.length) {
        flatten(i.items, flattened);
      }
    });
  };

  flatten(items, flattenedItems);

  return flattenedItems;
};

export default useCollectionStore;
