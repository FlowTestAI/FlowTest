import { getDirectoryName, getSubdirectoriesFromRoot, PATH_SEPARATOR } from './filesystem';

/**
 * In memory store to keep track of collection tree for each collection.
 * Collection tree tracks the full list of files, directories and their children 
 * under this collection so that UI can render the most updated information.
 */

export class InMemoryStateStore {

    private state = {
        collections: []
    };

    public createCollection(collection) {
        const collectionIds = this.state.collections.map((c) => c.id);
  
        if (!collectionIds.includes(collection.uid)) {
          this.state.collections.push(collection);
          console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} initialized`)
        }
    }

    public removeCollection(collectionId: string) {
        const collection = this.state.collections.find(c => c.id === collectionId)
        this.state.collections = this.state.collections.filter((c) => c.id !== collectionId);
        console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} removed`)
    }

    public addFile(file) {
        const collection = this.state.collections.find((c) => c.id === file.id);
  
        if (collection) {
            const dirname = getDirectoryName(file.pathname)
            const subDirectories = getSubdirectoriesFromRoot(collection.pathname, dirname);
            let currentPath = collection.pathname;
            let currentSubItems = collection.items;
            for (const directoryName of subDirectories) {
                let childItem = currentSubItems.find((f) => f.type === 'folder' && f.name === directoryName);
                if (!childItem) {
                    childItem = {
                        id: file.id,
                        pathname: `${currentPath}${PATH_SEPARATOR}${directoryName}`,
                        name: directoryName,
                        type: 'folder',
                        items: []
                    };
                    currentSubItems.push(childItem);
                }

                currentPath = `${currentPath}${PATH_SEPARATOR}${directoryName}`;
                currentSubItems = childItem.items;
            }

            if (!currentSubItems.find((f) => f.name === file.name)) {
                currentSubItems.push(file);
                console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
            }
        }
    }

    public addDirectory(directory) {
        const collection = this.state.collections.find((c) => c.id === directory.id);

        if (collection) {
            const subDirectories = getSubdirectoriesFromRoot(collection.pathname, directory.pathname);
            let currentPath = collection.pathname;
            let currentSubItems = collection.items;
            for (const directoryName of subDirectories) {
                let childItem = currentSubItems.find((f) => f.type === 'folder' && f.name === directoryName);
                if (!childItem) {
                    childItem = {
                        id: directory.id,
                        pathname: `${currentPath}${PATH_SEPARATOR}${directoryName}`,
                        name: directoryName,
                        type: 'folder',
                        items: []
                    };
                    currentSubItems.push(childItem);
                }

                currentPath = `${currentPath}${PATH_SEPARATOR}${directoryName}`;
                currentSubItems = childItem.items;
            }
            console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
        }
    }

    public changeFile(file) {
        const collection = this.state.collections.find((c) => c.id === file.id);
  
        if (collection) {
            const item = this.findItemInCollectionTree(file, collection);

            if (item) {
                item.data = file.data;
                console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
            }
        }
    }

    public unlinkFile(file) {
        const collection = this.state.collections.find((c) => c.id === file.id);
  
        if (collection) {
            const item = this.findItemInCollectionTree(file, collection);

            if (item) {
                this.deleteItemInCollectionByPathname(item.pathname, collection)
                console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
            }
        }
    }

    public unlinkDirectory(directory) {
        const collection = this.state.collections.find((c) => c.id === directory.id);
  
        if (collection) {
            // if it's the collection itself
            if (collection.pathname === directory.pathname && collection.name === directory.name) {
                this.removeCollection(collection.id)
            } else {
                const item = this.findItemInCollectionTree(directory, collection);

                if (item) {
                    this.deleteItemInCollectionByPathname(item.pathname, collection)
                    console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
                }
            }
        }
    }

    private findItemInCollectionTree(item, collection) {
        let flattenedItems = this.flattenItems(collection.items);

        return flattenedItems.find(i => i.pathname === item.pathname && i.name === item.name);
    }

    private deleteItemInCollectionByPathname(pathname, collection) {
        collection.items = collection.items.filter((i) => i.pathname !== pathname);
      
        let flattenedItems = this.flattenItems(collection.items);
        flattenedItems.forEach((i) => {
          if (i.items && i.items.length) {
            i.items = i.items.filter((i) => i.pathname !== pathname);
          }
        });
    };

    private flattenItems(items = []) {
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
}
