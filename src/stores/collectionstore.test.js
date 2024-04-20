import { act, renderHook } from '@testing-library/react';
import useCollectionStore from './CollectionStore';

describe('Collection store', () => {
  const collectionObj = {
    version: '1',
    id: '1',
    type: 'collection',
    name: 'collection',
    pathname: '/parent/collection',
    nodes: [],
    items: [],
    environments: [],
  };

  it('should correctly add and delete directory in the collection tree', () => {
    const { result } = renderHook(() => useCollectionStore());

    // create collection
    act(() => {
      result.current.createCollection('1', 'collection', '/parent/collection', []);
    });
    let collection = result.current.collections[0];
    expect(collection).toEqual(collectionObj);

    // Create a new folder inside collection
    let directory = {
      name: 'test-suite-1',
      pathname: '/parent/collection/test-suite-1',
    };
    act(() => {
      result.current.createFolder(directory, '1', ['test-suite-1'], '/');
    });

    collection = result.current.collections[0];
    expect(collection.items[0].type).toEqual('folder');
    expect(collection.items[0].name).toEqual(directory.name);
    expect(collection.items[0].pathname).toEqual(directory.pathname);

    directory = {
      name: 'test-suite-3',
      pathname: '/parent/collection/test-suite-1/test-suite-2/test-suite-3',
    };
    act(() => {
      result.current.createFolder(directory, '1', ['test-suite-1', 'test-suite-2', 'test-suite-3'], '/');
    });
    collection = result.current.collections[0];
    expect(collection.items[0].items[0].name).toEqual('test-suite-2');
    expect(collection.items[0].items[0].pathname).toEqual('/parent/collection/test-suite-1/test-suite-2');

    expect(collection.items[0].items[0].items[0].name).toEqual(directory.name);
    expect(collection.items[0].items[0].items[0].pathname).toEqual(directory.pathname);

    directory = {
      name: 'test-suite-2',
      pathname: '/parent/collection/test-suite-1/test-suite-2',
    };
    act(() => {
      result.current.deleteFolder(directory, '1');
    });
    collection = result.current.collections[0];
    expect(collection.items[0].items).toEqual([]);

    directory = {
      name: 'collection',
      pathname: '/parent/collection',
    };
    act(() => {
      result.current.deleteFolder(directory, '1');
    });
    expect(result.current.collections).toEqual([]);
  });

  it('should correctly add/delete/change file in the collection tree', () => {
    const { result } = renderHook(() => useCollectionStore());

    // create collection
    act(() => {
      result.current.createCollection('1', 'collection', '/parent/collection', []);
    });

    let directory = {
      name: 'test-suite-3',
      pathname: '/parent/collection/test-suite-1/test-suite-2/test-suite-3',
    };
    act(() => {
      result.current.createFolder(directory, '1', ['test-suite-1', 'test-suite-2', 'test-suite-3'], '/');
    });

    act(() => {
      result.current.createFlowTest(
        {
          name: 'test1.flow',
          pathname: '/parent/collection/test-suite-1/test1.flow',
          subDirectories: ['test-suite-1'],
          sep: '/',
        },
        collectionObj.id,
      );
    });

    act(() => {
      result.current.createFlowTest(
        {
          name: 'test2.flow',
          pathname: '/parent/collection/test-suite-1/test-suite-2/test2.flow',
          subDirectories: ['test-suite-1', 'test-suite-2'],
          sep: '/',
        },
        collectionObj.id,
      );
    });

    act(() => {
      result.current.createFlowTest(
        {
          name: 'test3.flow',
          pathname: '/parent/collection/test-suite-1/test-suite-2/test-suite-3/test3.flow',
          subDirectories: ['test-suite-1', 'test-suite-2', 'test-suite-3'],
          sep: '/',
        },
        collectionObj.id,
      );
    });

    const collection = result.current.collections[0];
    const file1ModifiedTime = collection.items[0].items[1].modifiedAt;
    expect(collection.items[0].items[1].type).toEqual('flowtest');
    expect(collection.items[0].items[1].name).toEqual('test1.flow');
    expect(collection.items[0].items[1].pathname).toEqual('/parent/collection/test-suite-1/test1.flow');

    expect(collection.items[0].items[0].items[1].type).toEqual('flowtest');
    expect(collection.items[0].items[0].items[1].name).toEqual('test2.flow');
    expect(collection.items[0].items[0].items[1].pathname).toEqual(
      '/parent/collection/test-suite-1/test-suite-2/test2.flow',
    );

    expect(collection.items[0].items[0].items[0].items[0].type).toEqual('flowtest');
    expect(collection.items[0].items[0].items[0].items[0].name).toEqual('test3.flow');
    expect(collection.items[0].items[0].items[0].items[0].pathname).toEqual(
      '/parent/collection/test-suite-1/test-suite-2/test-suite-3/test3.flow',
    );

    act(() => {
      result.current.updateFlowTest(
        {
          name: 'test1.flow',
          pathname: '/parent/collection/test-suite-1/test1.flow',
        },
        collectionObj.id,
      );
    });
    expect(result.current.collections[0].items[0].items[1].modifiedAt > file1ModifiedTime).toEqual(true);

    act(() => {
      result.current.deleteFlowTest(
        {
          name: 'test1.flow',
          pathname: '/parent/collection/test-suite-1/test1.flow',
        },
        collectionObj.id,
      );
    });
    expect(result.current.collections[0].items[0].items[1]).toEqual(undefined);

    directory = {
      name: 'collection',
      pathname: '/parent/collection',
    };
    act(() => {
      result.current.deleteFolder(directory, '1');
    });
    expect(result.current.collections).toEqual([]);
  });

  it('should add environment and dotEnv file correctly in collection tree', () => {
    const { result } = renderHook(() => useCollectionStore());

    // create collection
    act(() => {
      result.current.createCollection('1', 'collection', '/parent/collection', []);
    });

    let directory = {
      name: 'test-suite-3',
      pathname: '/parent/collection/test-suite-1/test-suite-2/test-suite-3',
    };
    act(() => {
      result.current.createFolder(directory, '1', ['test-suite-1', 'test-suite-2', 'test-suite-3'], '/');
    });

    const variables = {
      k1: 'v1',
      k2: 'v2',
    };
    act(() => {
      result.current.addOrUpdateEnvFile(
        {
          name: 'staging.env',
          pathname: '/parent/collection/environments/staging.env',
          variables,
        },
        collectionObj.id,
      );
    });

    const dotEnvVars = {
      k: 'v',
      v: 'k',
    };
    act(() => {
      result.current.addOrUpdateDotEnvVariables(dotEnvVars, collectionObj.id);
    });

    const collection = result.current.collections[0];
    expect(collection.environments[0].type).toEqual('environment');
    expect(collection.environments[0].variables).toEqual(variables);
    expect(collection.dotEnvVariables).toEqual(dotEnvVars);

    act(() => {
      result.current.addOrUpdateEnvFile(
        {
          name: 'staging.env',
          pathname: '/parent/collection/environments/staging.env',
          variables: {
            ...variables,
            k3: 'v3',
          },
        },
        collectionObj.id,
      );
    });

    act(() => {
      result.current.addOrUpdateDotEnvVariables(
        {
          ...dotEnvVars,
          t: 'k',
        },
        collectionObj.id,
      );
    });

    expect(result.current.collections[0].environments[0].type).toEqual('environment');
    expect(result.current.collections[0].environments[0].variables).toEqual({
      ...variables,
      k3: 'v3',
    });
    expect(result.current.collections[0].dotEnvVariables).toEqual({
      ...dotEnvVars,
      t: 'k',
    });

    act(() => {
      result.current.deleteEnvFile(
        {
          name: 'staging.env',
          pathname: '/parent/collection/environments/staging.env',
        },
        collectionObj.id,
      );
    });
    expect(result.current.collections[0].environments).toEqual([]);

    // try to remove a env file should not error out
    act(() => {
      result.current.deleteEnvFile(
        {
          name: 'staging.env',
          pathname: '/parent/collection/environments/staging.env',
        },
        collectionObj.id,
      );
    });
    expect(result.current.collections[0].environments).toEqual([]);

    directory = {
      name: 'collection',
      pathname: '/parent/collection',
    };
    act(() => {
      result.current.deleteFolder(directory, '1');
    });
    expect(result.current.collections).toEqual([]);
  });
});
