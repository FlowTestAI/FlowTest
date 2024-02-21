import useCollectionStore from 'newUserInterface/stores/collections';
import { useEffect } from 'react';

const registerMainEventHandlers = () => {
  const _createCollection = useCollectionStore((state) => state.createCollection);
  const _createFolder = useCollectionStore((state) => state.createFolder);

  useEffect(() => {
    const { ipcRenderer } = window;

    ipcRenderer.on('main:collection-created', (id, name, pathname) => {
      _createCollection(id, name, pathname);
    });

    ipcRenderer.on('main:add-directory', (directory, collectionId, subDirsFromRoot, PATH_SEPARATOR) => {
      _createFolder(directory, collectionId, subDirsFromRoot, PATH_SEPARATOR);
    });
  }, []);
};

export default registerMainEventHandlers;
