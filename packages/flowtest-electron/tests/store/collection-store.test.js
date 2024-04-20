const path = require('path');

const Collections = require('../../src/store/collection');
const createDirectory = require('../../src/utils/filemanager/createdirectory');
const deleteDirectory = require('../../src/utils/filemanager/deletedirectory');

describe('collection-store', () => {
  it('should create and remove collection', async () => {
    const store = new Collections();
    const newCollection = {
      id: '1234',
      name: 'test',
      pathname: `${__dirname}/test`,
      openapi_spec: '',
      nodes: '{}',
    };

    const newestCollection = {
      id: '12345',
      name: 'test1',
      pathname: `${__dirname}/test1`,
      openapi_spec: '',
      nodes: '{}',
    };

    store.removeAll();
    expect(store.getAll()).toEqual([]);

    // adding a collection whose directory doesn't exist
    store.add(newCollection);
    expect(store.getAll()).toEqual([]);

    createDirectory('test', __dirname);
    store.add(newCollection);
    expect(store.getAll()).toEqual([newCollection]);

    createDirectory('test1', __dirname);
    store.add(newestCollection);
    expect(store.getAll()).toEqual([newCollection, newestCollection]);

    store.remove(newCollection);
    expect(store.getAll()).toEqual([newestCollection]);

    store.remove(newestCollection);
    expect(store.getAll()).toEqual([]);

    deleteDirectory(`${__dirname}/test`);
    deleteDirectory(`${__dirname}/test1`);
  });

  it('collection set should be unique by pathname', async () => {
    const store = new Collections();
    const newCollection = {
      id: '1234',
      name: 'test',
      pathname: `${__dirname}/test`,
      openapi_spec: '',
      nodes: '{}',
    };

    const newestCollection = {
      id: '12345',
      name: 'test',
      pathname: `${__dirname}/test`,
      openapi_spec: '',
      nodes: '{}',
    };

    store.removeAll();
    expect(store.getAll()).toEqual([]);

    createDirectory('test', __dirname);
    store.add(newCollection);
    expect(store.getAll()).toEqual([newCollection]);

    // collection in the store should be unique by path
    store.add(newestCollection);
    expect(store.getAll()).toEqual([newCollection]);

    store.remove(newCollection);
    expect(store.getAll()).toEqual([]);

    deleteDirectory(`${__dirname}/test`);
  });
});
