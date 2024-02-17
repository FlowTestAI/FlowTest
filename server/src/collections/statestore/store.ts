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
          console.log(`[InMemoryStore] collection added: ${JSON.stringify(collection)}`)
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

    public addFile(file, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            const dirname = getDirectoryName(file.pathname)
            const subDirectories = getSubdirectoriesFromRoot(collection.pathname, dirname);
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

            if (!currentSubItems.find((f) => f.name === file.name)) {
                const timestamp = Date.now();
                currentSubItems.push({
                    id: uuidv4(),
                    createdAt: timestamp,
                    modifiedAt: timestamp,
                    ...file
                });
                console.log(`[InMemoryStore] collection updated: ${JSON.stringify(collection)}`)
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

    public changeFile(file, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            const item = this.findItemInCollectionTree(file, collection);

            if (item) {
                item.modifiedAt = Date.now();
                console.log(`[InMemoryStore] collection updated: ${JSON.stringify(collection)}`)
            } else {
                console.log(`[InMemoryStore] collection tree item not found: ${file.pathname}`)
            }
        }
    }

    public unlinkFile(file, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            const item = this.findItemInCollectionTree(file, collection);

            if (item) {
                this.deleteItemInCollectionByPathname(item.pathname, collection)
                console.log(`[InMemoryStore] collection updated: ${JSON.stringify(collection)}`)
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

    public addEnvFile(file, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            const existingEnv = collection.enviroments.find((e) => e.name === file.name && e.pathname === file.pathname);
            if (existingEnv) {
                existingEnv.modifiedAt = Date.now();
                existingEnv.variables = file.variables;
                console.log(`[InMemoryStore] collection env updated: ${JSON.stringify(collection)}`)
            } else {
                const timestamp = Date.now();
                collection.enviroments.push({
                    id: uuidv4(),
                    createdAt: timestamp,
                    modifiedAt: timestamp,
                    ...file
                });
                console.log(`[InMemoryStore] collection env added: ${JSON.stringify(collection)}`)
            }
        }
    }

    public unlinkEnvFile(file, collectionId: string) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection && collection.enviroments) {
            collection.enviroments = collection.enviroments.filter((e) => e.name !== file.name && e.pathname !== file.pathname)
            console.log(`[InMemoryStore] collection updated: ${JSON.stringify(collection)}`)
        }
    }

    public addOrUpdateDotEnvVariables(collectionId, variables) {
        const collection = this.state.collections.find((c) => c.id === collectionId);
  
        if (collection) {
            collection.dotEnvVariables = variables;
            console.log(`[InMemoryStore] collection dotenv variables added/updated: ${JSON.stringify(collection)}`)
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
