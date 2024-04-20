import { create } from 'zustand';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import {
  findItemInCollectionTree,
  deleteItemInCollectionByPathname,
  findItemInCollectionByPathname,
  flattenItems,
} from './utils.js';
import { useEventStore } from './EventListenerStore.js';
import { useTabStore } from './TabStore.js';
import { OBJ_TYPES } from 'constants/Common.js';
import { cloneDeep } from 'lodash';

const useCollectionStore = create((set, get) => ({
  collections: [],
  createCollection: (id, name, pathname, nodes) => {
    const collectionObj = {
      version: '1',
      id: id,
      type: OBJ_TYPES.collection,
      name: name,
      pathname: pathname,
      collapsed: true,
      nodes: nodes,
      items: [],
      environments: [],
      envCollapsed: true,
    };
    if (!get().collections.find((c) => c.pathname === pathname)) {
      set((state) => ({ collections: [...state.collections, collectionObj] }));
      console.log(`Collection added => id: ${id}, name: ${name}, pathname: ${pathname}`);
    }
  },
  deleteCollection(collectionId) {
    set((state) => ({ collections: state.collections.filter((c) => c.id != collectionId) }));
    console.log(`Collection removed: ${collectionId}`);

    // check if there any open tabs, if yes close them
    useTabStore.getState().closeCollectionTabs(collectionId);
  },
  createFolder: (directory, collectionId, subDirsFromRoot, PATH_SEPARATOR) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          let currentPath = collection.pathname;
          let currentSubItems = collection.items;
          for (const directoryName of subDirsFromRoot) {
            let childItem = currentSubItems.find((f) => f.type === OBJ_TYPES.folder && f.name === directoryName);
            if (!childItem) {
              childItem = {
                id: uuidv4(),
                pathname: `${currentPath}${PATH_SEPARATOR}${directoryName}`,
                name: directoryName,
                type: OBJ_TYPES.folder,
                collapsed: true,
                items: [],
              };
              currentSubItems.push(childItem);
            }

            currentPath = `${currentPath}${PATH_SEPARATOR}${directoryName}`;
            currentSubItems = childItem.items;
          }
          //console.log(`Collection folder created: ${JSON.stringify(get().collections)}`);
        }
      }),
    );
  },
  deleteFolder: (directory, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          // if it's the collection itself
          if (collection.pathname === directory.pathname && collection.name === directory.name) {
            state.collections = state.collections.filter((c) => c.id != collectionId);
            console.log(`Collection removed: ${collectionId}`);

            // check if there any open tabs, if yes close them
            useTabStore.getState().closeCollectionTabs(collectionId);
          } else {
            const item = findItemInCollectionTree(directory, collection);

            if (item) {
              const flowTestIds = flattenItems(item.items).map((i) => {
                if (i.type !== OBJ_TYPES.folder) {
                  i.id;
                }
              });

              deleteItemInCollectionByPathname(item.pathname, collection);
              //console.log(`Collection folder deleted: ${JSON.stringify(get().collections)}`);

              // check if there any open tabs, if yes close them
              useTabStore.getState().closeTabs(flowTestIds, collectionId);
            }
          }
        }
      }),
    );
  },
  addOrUpdateEnvFile: (file, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          const existingEnv = collection.environments.find((e) => e.name === file.name && e.pathname === file.pathname);
          if (existingEnv) {
            existingEnv.modifiedAt = Date.now();
            existingEnv.variables = file.variables;
            console.log(`Collection env updated: ${JSON.stringify(existingEnv)}`);

            // check if there are any open tabs, if yes mark them saved
            const tab = useTabStore.getState().tabs.find((t) => t.id === existingEnv.id);
            if (tab && tab.variablesDraft) {
              tab.variables = cloneDeep(tab.variablesDraft);
              tab.variablesDraft = null;
            }
          } else {
            const timestamp = Date.now();
            const env = {
              id: uuidv4(),
              type: OBJ_TYPES.environment,
              createdAt: timestamp,
              modifiedAt: timestamp,
              ...file,
            };
            collection.environments.push(env);
            console.log(`Collection env added: ${JSON.stringify(env)}`);
            // check if there are any open tab requests
            const event = useEventStore
              .getState()
              .events.find(
                (e) => e.type === 'OPEN_NEW_ENVIRONMENT' && e.collectionId === collectionId && e.name === file.name,
              );
            if (event) {
              useTabStore.getState().addEnvTab(env, collectionId);
              useEventStore.getState().removeEvent(event.id);
            }
          }
        }
      }),
    );
  },
  deleteEnvFile: (file, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection && collection.environments) {
          const existingEnv = collection.environments.find((e) => e.name === file.name && e.pathname === file.pathname);
          if (existingEnv) {
            collection.environments = collection.environments.filter(
              (e) => e.name !== file.name && e.pathname !== file.pathname,
            );
            console.log(`Collection env removed: ${JSON.stringify(existingEnv)}`);
            // remove any open tab of this env
            useTabStore.getState().closeTab(existingEnv.id, collectionId);
          }
        }
      }),
    );
  },
  addOrUpdateDotEnvVariables: (variables, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          collection.dotEnvVariables = variables;
          console.log(`Collection dotenv variables added/updated: ${JSON.stringify(collection.dotEnvVariables)}`);
        }
      }),
    );
  },
  createFlowTest: (file, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          const PATH_SEPARATOR = file.sep;
          let currentPath = collection.pathname;
          let currentSubItems = collection.items;
          for (const directoryName of file.subDirectories) {
            let childItem = currentSubItems.find((f) => f.type === OBJ_TYPES.folder && f.name === directoryName);
            if (!childItem) {
              childItem = {
                id: uuidv4(),
                pathname: `${currentPath}${PATH_SEPARATOR}${directoryName}`,
                name: directoryName,
                type: OBJ_TYPES.folder,
                collapsed: true,
                items: [],
              };
              currentSubItems.push(childItem);
            }

            currentPath = `${currentPath}${PATH_SEPARATOR}${directoryName}`;
            currentSubItems = childItem.items;
          }

          if (!currentSubItems.find((f) => f.name === file.name)) {
            const timestamp = Date.now();
            const flowtest = {
              id: uuidv4(),
              type: OBJ_TYPES.flowtest,
              createdAt: timestamp,
              modifiedAt: timestamp,
              name: file.name,
              pathname: file.pathname,
            };
            currentSubItems.push(flowtest);
            //console.log(`Collection updated: ${JSON.stringify(collection)}`);

            // check if there are any open tab requests
            const event = useEventStore
              .getState()
              .events.find(
                (e) =>
                  e.type === 'OPEN_NEW_FLOWTEST' &&
                  e.collectionId === collectionId &&
                  e.name === file.name &&
                  e.path === currentPath,
              );
            if (event) {
              useTabStore.getState().addFlowTestTab(
                {
                  ...flowtest,
                  flowData: file.flowData,
                },
                collectionId,
              );
              useEventStore.getState().removeEvent(event.id);
            }
          }
        }
      }),
    );
  },
  readFlowTest: (pathname, collectionId, flowData) => {
    const collection = get().collections.find((c) => c.id === collectionId);

    if (collection) {
      const item = findItemInCollectionByPathname(collection, pathname);

      if (item) {
        // check if there are any open tab requests
        const event = useEventStore
          .getState()
          .events.find(
            (e) =>
              e.type === 'OPEN_SAVED_FLOWTEST' &&
              e.collectionId === collectionId &&
              e.name === item.name &&
              e.pathname === item.pathname,
          );
        if (event) {
          useTabStore.getState().addFlowTestTab(
            {
              ...item,
              flowData,
            },
            collectionId,
          );
          useEventStore.getState().removeEvent(event.id);
        }
      }
    }
  },
  updateFlowTest: (file, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          const item = findItemInCollectionTree(file, collection);

          if (item) {
            item.modifiedAt = Date.now();
            // console.log(`Collection updated: ${JSON.stringify(collection)}`);

            // check if there are any open tabs, if yes mark them saved
            const tab = useTabStore.getState().tabs.find((t) => t.id === item.id);
            if (tab && tab.flowDataDraft) {
              tab.flowData = cloneDeep(tab.flowDataDraft);
              tab.flowDataDraft = null;
            }
          }
        }
      }),
    );
  },
  deleteFlowTest: (file, collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);

        if (collection) {
          const item = findItemInCollectionTree(file, collection);

          if (item) {
            deleteItemInCollectionByPathname(item.pathname, collection);
            //console.log(`Collection updated: ${JSON.stringify(collection)}`);

            // remove any open tab of this flowtest
            useTabStore.getState().closeTab(item.id, collectionId);
          }
        }
      }),
    );
  },
  clickItem: (item, collectionId) => {
    set(
      produce((state) => {
        if (item) {
          if (item.type === OBJ_TYPES.collection) {
            const collection = state.collections.find((c) => c.id === collectionId);
            if (collection) {
              collection.collapsed = !collection.collapsed;
            }
          } else if (item.type === OBJ_TYPES.folder) {
            const collection = state.collections.find((c) => c.id === collectionId);
            if (collection) {
              const findItem = findItemInCollectionTree(item, collection);
              findItem.collapsed = !findItem.collapsed;
            }
          }
        }
      }),
    );
  },
  clickEnvironments: (collectionId) => {
    set(
      produce((state) => {
        const collection = state.collections.find((c) => c.id === collectionId);
        if (collection) {
          collection.envCollapsed = !collection.envCollapsed;
        }
      }),
    );
  },
}));

export default useCollectionStore;
