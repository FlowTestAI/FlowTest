const chokidar = require('chokidar');
const path = require('path');
const dotenv = require('dotenv');

class Watcher {
  constructor() {
    this.watchers = {};
  }

  add(pathname, collectionId, watchPath) {}

  addDirectory(pathname, collectionId, watchPath) {
    console.log(`add dir event ${pathname}: ${collectionId}`);
  }

  change(pathname, collectionId, watchPath) {}

  unlink(pathname, collectionId, watchPath) {}

  unlinkDir(pathname, collectionId, watchPath) {}

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
        .on('add', (pathname) => this.add(pathname, collectionId, watchPath))
        .on('addDir', (pathname) => this.addDirectory(pathname, collectionId, watchPath))
        .on('change', (pathname) => this.change(pathname, collectionId, watchPath))
        .on('unlink', (pathname) => this.unlink(pathname, collectionId, watchPath))
        .on('unlinkDir', (pathname) => this.unlinkDir(pathname, collectionId, watchPath));

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
