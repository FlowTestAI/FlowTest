const chokidar = require('chokidar');
const path = require('path');
const dotenv = require('dotenv');
const { PATH_SEPARATOR, getSubdirectoriesFromRoot } = require('../utils/filemanager/filesystem');

class Watcher {
  constructor() {
    this.watchers = {};
  }

  add(mainWindow, pathname, collectionId, watchPath) {}

  addDirectory(mainWindow, pathname, collectionId, watchPath) {
    const envDirectory = path.join(watchPath, 'environments');

    if (pathname === envDirectory) {
      return;
    }

    if (pathname === watchPath) {
      // we have already added collection object to store
      return;
    }

    console.log(`directory ${pathname} added`);
    const directory = {
      name: path.basename(pathname),
      pathname: pathname,
    };

    const subDirsFromRoot = getSubdirectoriesFromRoot(watchPath, directory.pathname);
    mainWindow.webContents.send('main:add-directory', directory, collectionId, subDirsFromRoot, PATH_SEPARATOR);
  }

  change(mainWindow, pathname, collectionId, watchPath) {}

  unlink(mainWindow, pathname, collectionId, watchPath) {}

  unlinkDir(mainWindow, pathname, collectionId, watchPath) {
    const envDirectory = path.join(watchPath, 'environments');

    if (pathname === envDirectory) {
      return;
    }

    console.log(`dir ${pathname} removed`);
    const directory = {
      name: path.basename(pathname),
      pathname: pathname,
    };
    mainWindow.webContents.send('main:delete-directory', directory, collectionId);
  }

  addWatcher(mainWindow, watchPath, collectionId) {
    if (this.watchers[watchPath]) {
      this.watchers[watchPath].close();
    }

    setTimeout(() => {
      const watcher = chokidar.watch(watchPath, {
        ignoreInitial: false,
        usePolling: watchPath.startsWith('\\\\') ? true : false,
        ignored: (path) => ['node_modules', '.git'].some((s) => path.includes(s)),
        persistent: true,
        ignorePermissionErrors: true,
        awaitWriteFinish: {
          stabilityThreshold: 80,
          pollInterval: 10,
        },
        depth: 20,
      });

      watcher
        .on('add', (pathname) => this.add(mainWindow, pathname, collectionId, watchPath))
        .on('addDir', (pathname) => this.addDirectory(mainWindow, pathname, collectionId, watchPath))
        .on('change', (pathname) => this.change(mainWindow, pathname, collectionId, watchPath))
        .on('unlink', (pathname) => this.unlink(mainWindow, pathname, collectionId, watchPath))
        .on('unlinkDir', (pathname) => this.unlinkDir(mainWindow, pathname, collectionId, watchPath));

      this.watchers[watchPath] = watcher;
    }, 100);
  }

  hasWatcher(watchPath) {
    return this.watchers[watchPath] != undefined ? true : false;
  }

  removeWatcher(watchPath) {
    if (this.watchers[watchPath]) {
      this.watchers[watchPath].close();
      this.watchers[watchPath] = null;
    }
  }
}

module.exports = Watcher;
