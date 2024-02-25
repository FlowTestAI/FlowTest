const chokidar = require('chokidar');
const path = require('path');
const dotenv = require('dotenv');
const { PATH_SEPARATOR, getSubdirectoriesFromRoot, getDirectoryName } = require('../utils/filemanager/filesystem');
const readFile = require('../utils/filemanager/readfile');

class Watcher {
  constructor() {
    this.watchers = {};
  }

  isFlowTestFile(pathname) {
    if (!pathname || typeof pathname !== 'string') return false;
    return ['flow'].some((ext) => pathname.toLowerCase().endsWith(`.${ext}`));
  }

  isEnvFile(pathname, collectionPath) {
    if (!pathname || typeof pathname !== 'string') return false;
    const dirname = path.dirname(pathname);
    const envDirectory = path.join(collectionPath, 'environments');

    return dirname === envDirectory && ['env'].some((ext) => pathname.toLowerCase().endsWith(`.${ext}`));
  }

  isDotEnvFile(pathname, collectionPath) {
    const dirname = path.dirname(pathname);
    const basename = path.basename(pathname);

    return dirname === collectionPath && basename === '.env';
  }

  add(mainWindow, pathname, collectionId, watchPath) {
    console.log(`[Watcher] File ${pathname} added`);
    if (this.isFlowTestFile(pathname)) {
      const dirname = getDirectoryName(file.pathname);
      const subDirectories = getSubdirectoriesFromRoot(pathname, dirname);
      const file = {
        name: path.basename(pathname),
        pathname: pathname,
        subDirectories,
        sep: PATH_SEPARATOR,
      };
      mainWindow.webContents.send('main:create-flowtest', file, collectionId);
    } else if (this.isEnvFile(pathname, watchPath)) {
      try {
        const variables = this.getEnvVariables(pathname);
        const file = {
          name: path.basename(pathname),
          pathname: pathname,
          variables,
        };
        mainWindow.webContents.send('main:addOrUpdate-environment', file, collectionId);
      } catch (error) {
        console.error(`Failed to add ${pathname} due to: ${error}`);
      }
    } else if (this.isDotEnvFile(pathname, watchPath)) {
      try {
        const variables = this.getEnvVariables(pathname);
        mainWindow.webContents.send('main:addOrUpdate-dotEnvironment', variables, collectionId);
      } catch (error) {
        console.error(`Failed to add .env variables due to: ${error}`);
      }
    }
  }

  addDirectory(mainWindow, pathname, collectionId, watchPath) {
    const envDirectory = path.join(watchPath, 'environments');

    if (pathname === envDirectory) {
      return;
    }

    if (pathname === watchPath) {
      // we have already added collection object to store
      return;
    }

    console.log(`[Watcher] Directory ${pathname} added`);
    const directory = {
      name: path.basename(pathname),
      pathname: pathname,
    };

    const subDirsFromRoot = getSubdirectoriesFromRoot(watchPath, directory.pathname);
    mainWindow.webContents.send('main:add-directory', directory, collectionId, subDirsFromRoot, PATH_SEPARATOR);
  }

  change(mainWindow, pathname, collectionId, watchPath) {
    console.log(`[Watcher] file ${pathname} changed`);
    if (this.isFlowTestFile(pathname)) {
      const file = {
        name: path.basename(pathname),
        pathname: pathname,
      };
      mainWindow.webContents.send('main:update-flowtest', file, collectionId);
    } else if (this.isEnvFile(pathname, watchPath)) {
      try {
        const variables = this.getEnvVariables(pathname);
        const file = {
          name: path.basename(pathname),
          pathname: pathname,
          variables,
        };
        mainWindow.webContents.send('main:addOrUpdate-environment', file, collectionId);
      } catch (error) {
        console.error(`Failed to save ${pathname} due to: ${error}`);
      }
    } else if (this.isDotEnvFile(pathname, watchPath)) {
      try {
        const variables = this.getEnvVariables(pathname);
        mainWindow.webContents.send('main:addOrUpdate-dotEnvironment', variables, collectionId);
      } catch (error) {
        console.error(`Failed to add .env variables due to: ${error}`);
      }
    }
  }

  unlink(mainWindow, pathname, collectionId, watchPath) {
    console.log(`[Watcher] File ${pathname} removed`);
    if (this.isFlowTestFile(pathname)) {
      const file = {
        name: path.basename(pathname),
        pathname: pathname,
      };
      mainWindow.webContents.send('main:delete-flowtest', file, collectionId);
    } else if (this.isEnvFile(pathname, watchPath)) {
      try {
        const file = {
          name: path.basename(pathname),
          pathname: pathname,
        };
        mainWindow.webContents.send('main:delete-environment', file, collectionId);
      } catch (error) {
        console.error(`Failed to save ${pathname} due to: ${error}`);
      }
    }
  }

  unlinkDir(mainWindow, pathname, collectionId, watchPath) {
    const envDirectory = path.join(watchPath, 'environments');

    if (pathname === envDirectory) {
      return;
    }

    console.log(`[Watcher] Directory ${pathname} removed`);
    const directory = {
      name: path.basename(pathname),
      pathname: pathname,
    };
    mainWindow.webContents.send('main:delete-directory', directory, collectionId);
  }

  getEnvVariables(pathname) {
    const content = readFile(pathname).content;
    const buf = Buffer.from(content);
    const parsed = dotenv.parse(buf);
    return parsed;
  }

  addWatcher(mainWindow, watchPath, collectionId) {
    if (!this.hasWatcher(watchPath)) {
      console.log(`[Watcher] watcher added for path: ${watchPath} `);
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
