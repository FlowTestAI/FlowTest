import useCollectionStore from 'newUserInterface/stores/collections';
import { useEffect } from 'react';

const registerMainEventHandlers = () => {
  const _createCollection = useCollectionStore((state) => state.createCollection);
  const _deleteCollection = useCollectionStore((state) => state.deleteCollection);
  const _createFolder = useCollectionStore((state) => state.createFolder);
  const _deleteFolder = useCollectionStore((state) => state.deleteFolder);

  useEffect(() => {
    const { ipcRenderer } = window;

    ipcRenderer.on('main:collection-created', (id, name, pathname) => {
      _createCollection(id, name, pathname);
    });

    ipcRenderer.on('main:collection-deleted', (collectionId) => {
      _deleteCollection(collectionId);
    });

    ipcRenderer.on('main:add-directory', (directory, collectionId, subDirsFromRoot, PATH_SEPARATOR) => {
      _createFolder(directory, collectionId, subDirsFromRoot, PATH_SEPARATOR);
    });

    ipcRenderer.on('main:delete-directory', (directory, collectionId) => {
      _deleteFolder(directory, collectionId);
    });
  }, []);
};

export default registerMainEventHandlers;
