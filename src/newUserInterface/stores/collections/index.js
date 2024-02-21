import { create } from 'zustand';

const useCollectionStore = create((set) => ({
  collections: [],
  createCollection: (id, pathname) =>
    set((state) => {
      const collectionObj = {
        version: '1',
        id: id,
        name: pathname, //path.basename(pathname),
        pathname: pathname,
        items: [],
        enviroments: [],
      };

      if (!state.collections.find((c) => c.pathname === pathname)) {
        state.collections.push(collectionObj);
      }
    }),
}));

export default useCollectionStore;
