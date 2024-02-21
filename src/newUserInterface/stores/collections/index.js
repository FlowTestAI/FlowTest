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
    }
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

      console.log(`Collection updated: ${JSON.stringify(get().collections)}`);
    }
  },
}));

export default useCollectionStore;
