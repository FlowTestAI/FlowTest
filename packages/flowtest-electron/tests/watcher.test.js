const Watcher = require('../src/app/watcher');
const path = require('path');

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
});
