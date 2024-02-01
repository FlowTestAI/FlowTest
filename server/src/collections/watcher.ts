import * as chokidar from 'chokidar'

export class Watcher {

    private watchers = {};

    private add(pathname: string, collectionId: string, watchPath: string) {
      console.log(`file ${pathname} added`)
    }

    private addDirectory(pathname: string, collectionId: string, watchPath: string) {
      console.log(`directory ${pathname} added`)
    }

    private change(pathname: string, collectionId: string, watchPath: string) {
      console.log(`file ${pathname} changed`)
    }

    private unlink(pathname: string, collectionId: string, watchPath: string) {
      console.log(`file ${pathname} removed`)
    }

    private unlinkDir(pathname: string, collectionId: string, watchPath: string) {
      console.log(`dir ${pathname} removed`)
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
          .on('add', (pathname) => this.add(pathname, collectionId, watchPath))
          .on('addDir', (pathname) => this.addDirectory(pathname, collectionId, watchPath))
          .on('change', (pathname) => this.change(pathname, collectionId, watchPath))
          .on('unlink', (pathname) => this.unlink(pathname, collectionId, watchPath))
          .on('unlinkDir', (pathname) => this.unlinkDir(pathname, collectionId, watchPath));
  
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