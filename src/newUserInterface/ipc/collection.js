import useCollectionStore from 'newUserInterface/stores/collections';
import { useEffect } from 'react';

const registerMainEventHandlers = () => {
  const _createCollection = useCollectionStore((state) => state.createCollection);

  useEffect(() => {
    const { ipcRenderer } = window;

    ipcRenderer.on('main:collection-created', (id, pathname) => {
      _createCollection(id, pathname);
    });
  }, []);
};

export default registerMainEventHandlers;
