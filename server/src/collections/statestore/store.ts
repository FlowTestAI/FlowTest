import { getDirectoryName, getSubdirectoriesFromRoot, PATH_SEPARATOR } from './filesystem';
import {v4 as uuidv4} from 'uuid';

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
        console.log(`[InMemoryStore] collection removed: ${JSON.stringify(collection)}`)
    }

    public getAllCollection() {
        return this.state.collections;
    }

    public getCollection(collectionId: string) {
        const collection = this.state.collections.find(c => c.id === collectionId)
        return collection;
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

    public addDirectory(directory, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);

        if (collection) {
            const subDirectories = getSubdirectoriesFromRoot(collection.pathname, directory.pathname);
            let currentPath = collection.pathname;
            let currentSubItems = collection.items;
            for (const directoryName of subDirectories) {
                let childItem = currentSubItems.find((f) => f.type === 'folder' && f.name === directoryName);
                if (!childItem) {
                    childItem = {
                        id: uuidv4(),
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
            console.log(`[InMemoryStore] collection updated: ${JSON.stringify(collection)}`)
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

    public unlinkDirectory(directory, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            // if it's the collection itself
            if (collection.pathname === directory.pathname && collection.name === directory.name) {
                this.removeCollection(collection.id)
            } else {
                const item = this.findItemInCollectionTree(directory, collection);

                if (item) {
                    this.deleteItemInCollectionByPathname(item.pathname, collection)
                    console.log(`[InMemoryStore] collection updated: ${JSON.stringify(collection)}`)
                }
            }
        }
    }

    public addEnvFile(file) {
        const collection = this.state.collections.find((c) => c.id === file.id);
  
        if (collection) {
            const existingEnv = collection.enviroments.find((e) => e.name === file.name && e.pathname === file.pathname);
            if (existingEnv) {
                existingEnv.variables = file.variables;
                console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
            } else {
                collection.enviroments.push(file);
                console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
            }
        }
    }

    public unlinkEnvFile(file) {
        const collection = this.state.collections.find((c) => c.id === file.id);
  
        if (collection) {
            collection.enviroments = collection.enviroments.filter((e) => e.name !== file.name && e.pathname !== file.pathname)
            console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
        }
    }

    public addOrUpdateDotEnvVariables(collectionId, variables) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            collection.dotEnvVariables = variables;
            console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} updated`)
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
