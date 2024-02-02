import * as chokidar from 'chokidar'
import * as path from 'path'
import readFile from '../controllers/file-manager/read-file';
import { InMemoryStateStore } from './statestore/store';

export class Watcher {

    private watchers = {};
    private store: InMemoryStateStore

    constructor(inMemoryStore: InMemoryStateStore) {
      this.store = inMemoryStore
    }

    private isFlowTestFile(pathname: string): Boolean {
      if (!pathname || typeof pathname !== 'string') return false;
      return ['flowtest.json'].some((ext) => pathname.toLowerCase().endsWith(`.${ext}`));
    }

    private add(pathname: string, collectionId: string) {
      console.log(`file ${pathname} added`)
      if (this.isFlowTestFile(pathname)) {
        const file = {
          id: collectionId,
          name: path.basename(pathname),
          pathname: pathname,
          data: readFile(pathname).content
        };
        this.store.addFile(file);
      }
    }

    private addDirectory(pathname: string, collectionId: string) {
      console.log(`directory ${pathname} added`)
      const directory = {
        id: collectionId,
        name: path.basename(pathname),
        pathname: pathname
      };
      this.store.addDirectory(directory)
    }

    private change(pathname: string, collectionId: string) {
      console.log(`file ${pathname} changed`)
      if (this.isFlowTestFile(pathname)) {
        const file = {
          id: collectionId,
          name: path.basename(pathname),
          pathname: pathname,
          data: readFile(pathname).content
        };
        this.store.changeFile(file);
      }
    }

    private unlink(pathname: string, collectionId: string) {
      console.log(`file ${pathname} removed`)
      if (this.isFlowTestFile(pathname)) {
        const file = {
          id: collectionId,
          name: path.basename(pathname),
          pathname: pathname
        };
        this.store.unlinkFile(file);
      }
    }

    private unlinkDir(pathname: string, collectionId: string) {
      console.log(`dir ${pathname} removed`)
      const directory = {
        id: collectionId,
        name: path.basename(pathname),
        pathname: pathname
      };
      this.store.unlinkDirectory(directory)
    }

    public addWatcher(watchPath: string, collectionId: string) {
      if (this.watchers[watchPath]) {
        this.watchers[watchPath].close();
      }
  
      const self = this;
      setTimeout(() => {
        const watcher = chokidar.watch(watchPath, {
          ignoreInitial: false,
          usePolling: watchPath.startsWith("\\\\") ? true : false,
          ignored: (path) => ['node_modules', '.git'].some((s) => path.includes(s)),
          persistent: true,
          ignorePermissionErrors: true,
          awaitWriteFinish: {
            stabilityThreshold: 80,
            pollInterval: 10
          },
          depth: 20
        });
  
        watcher
          .on('add', (pathname) => this.add(pathname, collectionId))
          .on('addDir', (pathname) => this.addDirectory(pathname, collectionId))
          .on('change', (pathname) => this.change(pathname, collectionId))
          .on('unlink', (pathname) => this.unlink(pathname, collectionId))
          .on('unlinkDir', (pathname) => this.unlinkDir(pathname, collectionId));
  
        self.watchers[watchPath] = watcher;
      }, 100);
    }

    hasWatcher(watchPath: string) {
      return this.watchers[watchPath];
    }

    removeWatcher(watchPath: string) {
      if (this.watchers[watchPath]) {
        this.watchers[watchPath].close();
        this.watchers[watchPath] = null;
      }
    }
}