const Watcher = require('../src/app/watcher');
const path = require('path');
const createDirectory = require('../src/utils/filemanager/createdirectory');
const deleteDirectory = require('../src/utils/filemanager/deletedirectory');
const createFile = require('../src/utils/filemanager/createfile');
const updateFile = require('../src/utils/filemanager/updatefile');

describe('watcher', () => {
  const watcher = new Watcher();
  const DIRECTORY_NAME = 'collection';
  const collectionPath = path.join(__dirname, DIRECTORY_NAME);
  const collectionId = '1234';
  const mainWindow = {
    webContents: {
      send: jest.fn((channel, ...args) => {}),
    },
  };

  beforeEach(() => {
    mainWindow.webContents.send.mockClear();
  });

  it('should watch add and delete directory', async () => {
    watcher.addDirectory(mainWindow, path.join(collectionPath, 'folder1'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:add-directory',
      {
        name: 'folder1',
        pathname: '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/folder1',
      },
      '1234',
      ['folder1'],
      '/',
    );

    watcher.addDirectory(mainWindow, path.join(collectionPath, 'environments'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);

    watcher.addDirectory(
      mainWindow,
      path.join(collectionPath, 'folder1', 'folder2', 'folder3'),
      collectionId,
      collectionPath,
    );
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:add-directory',
      {
        name: 'folder3',
        pathname: '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/folder1/folder2/folder3',
      },
      '1234',
      ['folder1', 'folder2', 'folder3'],
      '/',
    );

    watcher.unlinkDir(mainWindow, path.join(collectionPath, 'folder1'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:delete-directory',
      {
        name: 'folder1',
        pathname: '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/folder1',
      },
      '1234',
    );
  });

  it('should not do anything for environments folder', async () => {
    watcher.addDirectory(mainWindow, path.join(collectionPath, 'environments'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(0);

    watcher.unlinkDir(mainWindow, path.join(collectionPath, 'environments'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(0);
  });

  it('should watch add, change and delete flowtest files', async () => {
    watcher.add(mainWindow, path.join(collectionPath, 'test.flow'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:create-flowtest',
      {
        name: 'test.flow',
        pathname: '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/test.flow',
        sep: '/',
        subDirectories: [],
      },
      '1234',
    );

    watcher.add(mainWindow, path.join(collectionPath, 'folder1', 'folder2', 'test.flow'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:create-flowtest',
      {
        name: 'test.flow',
        pathname:
          '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/folder1/folder2/test.flow',
        sep: '/',
        subDirectories: ['folder1', 'folder2'],
      },
      '1234',
    );

    watcher.change(
      mainWindow,
      path.join(collectionPath, 'folder1', 'folder2', 'test.flow'),
      collectionId,
      collectionPath,
    );
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:update-flowtest',
      {
        name: 'test.flow',
        pathname:
          '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/folder1/folder2/test.flow',
      },
      '1234',
    );

    watcher.unlink(
      mainWindow,
      path.join(collectionPath, 'folder1', 'folder2', 'test.flow'),
      collectionId,
      collectionPath,
    );
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:delete-flowtest',
      {
        name: 'test.flow',
        pathname:
          '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/folder1/folder2/test.flow',
      },
      '1234',
    );
  });

  it('should watch add, change and delete env files', async () => {
    createDirectory(DIRECTORY_NAME, __dirname);
    createDirectory('environments', collectionPath);
    createFile('test.env', path.join(collectionPath, 'environments'), 'k1=v1\nk2=v2\nk3=v3');
    watcher.add(mainWindow, path.join(collectionPath, 'environments', 'test.env'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:addOrUpdate-environment',
      {
        name: 'test.env',
        pathname: '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/environments/test.env',
        variables: {
          k1: 'v1',
          k2: 'v2',
          k3: 'v3',
        },
      },
      '1234',
    );

    //environments folder is the source of truth for env files
    mainWindow.webContents.send.mockClear();
    watcher.add(mainWindow, path.join(collectionPath, 'test.env'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(0);

    updateFile(path.join(collectionPath, 'environments', 'test.env'), 'k2=v2\nk4=v4\nk6=v6');
    watcher.change(mainWindow, path.join(collectionPath, 'environments', 'test.env'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:addOrUpdate-environment',
      {
        name: 'test.env',
        pathname: '/Users/sjain/projects/FlowTest/packages/flowtest-electron/tests/collection/environments/test.env',
        variables: {
          k2: 'v2',
          k4: 'v4',
          k6: 'v6',
        },
      },
      '1234',
    );

    deleteDirectory(collectionPath);
  });

  it('should watch add and change dotenv file', async () => {
    createDirectory(DIRECTORY_NAME, __dirname);
    createFile('.env', collectionPath, 'k1=v1\nk2=v2\nk3=v3');
    watcher.add(mainWindow, path.join(collectionPath, '.env'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:addOrUpdate-dotEnvironment',
      {
        k1: 'v1',
        k2: 'v2',
        k3: 'v3',
      },
      '1234',
    );

    //.env is only allowed in collection root path
    mainWindow.webContents.send.mockClear();
    watcher.add(mainWindow, path.join(collectionPath, 'folder', '.env'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(0);

    updateFile(path.join(collectionPath, '.env'), 'k2=v2\nk4=v4\nk6=v6');
    watcher.change(mainWindow, path.join(collectionPath, '.env'), collectionId, collectionPath);
    expect(mainWindow.webContents.send).toHaveBeenCalledTimes(1);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      'main:addOrUpdate-dotEnvironment',
      {
        k2: 'v2',
        k4: 'v4',
        k6: 'v6',
      },
      '1234',
    );

    deleteDirectory(collectionPath);
  });
});
