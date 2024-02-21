import { create } from 'zustand';

const useCollectionStore = create((set, get) => ({
  collections: [],
  createCollection: (id, pathname) => {
    const collectionObj = {
      version: '1',
      id: id,
      name: pathname, //path.basename(pathname),
      pathname: pathname,
      items: [],
      enviroments: [],
    };
    if (!get().collections.find((c) => c.pathname === pathname)) {
      set((state) => ({ collections: [...state.collections, collectionObj] }));
    }
  },
}));

export default useCollectionStore;
