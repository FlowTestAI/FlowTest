import * as chokidar from 'chokidar';
import * as path from 'path';
import readFile from '../controllers/file-manager/read-file';
import { InMemoryStateStore } from './statestore/store';
import * as dotenv from 'dotenv';
import { readableDataToFlowData } from '../flowtest/parser';

export class Watcher {
  private watchers = {};
  private store: InMemoryStateStore;

  constructor(inMemoryStore: InMemoryStateStore) {
    this.store = inMemoryStore;
  }

  private isFlowTestFile(pathname: string): Boolean {
    if (!pathname || typeof pathname !== 'string') return false;
    return ['flow'].some((ext) => pathname.toLowerCase().endsWith(`.${ext}`));
  }

  private isEnvFile(pathname: string, collectionPath: string): Boolean {
    if (!pathname || typeof pathname !== 'string') return false;
    const dirname = path.dirname(pathname);
    const envDirectory = path.join(collectionPath, 'environments');

    return dirname === envDirectory && ['env'].some((ext) => pathname.toLowerCase().endsWith(`.${ext}`));
  }

  private isDotEnvFile(pathname: string, collectionPath: string): Boolean {
    const dirname = path.dirname(pathname);
    const basename = path.basename(pathname);

    return dirname === collectionPath && basename === '.env';
  }

  private add(pathname: string, collectionId: string, watchPath: string) {
    console.log(`[Watcher] file ${pathname} added`);
    if (this.isFlowTestFile(pathname)) {
      const file = {
        name: path.basename(pathname),
        pathname: pathname,
      };
      this.store.addFile(file, collectionId);
    } else if (this.isEnvFile(pathname, watchPath)) {
      try {
        const variables = this.getEnvVariables(pathname);
        const file = {
          name: path.basename(pathname),
          pathname: pathname,
          variables,
        };
        this.store.addOrUpdateEnvFile(file, collectionId);
      } catch (error) {
        console.error(`Failed to add ${pathname} due to: ${error}`);
      }
    } else if (this.isDotEnvFile(pathname, watchPath)) {
      try {
        const variablesJson = this.getEnvVariables(pathname);
        this.store.addOrUpdateDotEnvVariables(collectionId, variablesJson);
      } catch (error) {
        console.error(`Failed to add .env variables due to: ${error}`);
      }
    }
  }

  private addDirectory(pathname: string, collectionId: string, watchPath: string) {
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
    this.store.addDirectory(directory, collectionId);
  }

  private change(pathname: string, collectionId: string, watchPath: string) {
    console.log(`[Watcher] file ${pathname} changed`);
    if (this.isFlowTestFile(pathname)) {
      const file = {
        name: path.basename(pathname),
        pathname: pathname,
      };
      this.store.changeFile(file, collectionId);
    } else if (this.isEnvFile(pathname, watchPath)) {
      try {
        const variables = this.getEnvVariables(pathname);
        const file = {
          name: path.basename(pathname),
          pathname: pathname,
          variables,
        };
        this.store.addOrUpdateEnvFile(file, collectionId);
      } catch (error) {
        console.error(`Failed to save ${pathname} due to: ${error}`);
      }
    } else if (this.isDotEnvFile(pathname, watchPath)) {
      try {
        const variablesJson = this.getEnvVariables(pathname);
        this.store.addOrUpdateDotEnvVariables(collectionId, variablesJson);
      } catch (error) {
        console.error(`Failed to add .env variables due to: ${error}`);
      }
    }
  }

  private unlink(pathname: string, collectionId: string, watchPath: string) {
    console.log(`file ${pathname} removed`);
    if (this.isFlowTestFile(pathname)) {
      const file = {
        name: path.basename(pathname),
        pathname: pathname,
      };
      this.store.unlinkFile(file, collectionId);
    } else if (this.isEnvFile(pathname, watchPath)) {
      try {
        const file = {
          name: path.basename(pathname),
          pathname: pathname,
        };
        this.store.unlinkEnvFile(file, collectionId);
      } catch (error) {
        console.error(`Failed to save ${pathname} due to: ${error}`);
      }
    }
  }

  private unlinkDir(pathname: string, collectionId: string, watchPath: string) {
    const envDirectory = path.join(watchPath, 'environments');

    if (pathname === envDirectory) {
      return;
    }

    console.log(`dir ${pathname} removed`);
    const directory = {
      name: path.basename(pathname),
      pathname: pathname,
    };
    this.store.unlinkDirectory(directory, collectionId);
  }

  private getEnvVariables(pathname: string) {
    const content = readFile(pathname).content;
    const buf = Buffer.from(content);
    const parsed = dotenv.parse(buf);
    return parsed;
  }

  public addWatcher(watchPath: string, collectionId: string) {
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

  hasWatcher(watchPath: string) {
    return this.watchers[watchPath] != undefined ? true : false;
  }

  removeWatcher(watchPath: string) {
    if (this.watchers[watchPath]) {
      this.watchers[watchPath].close();
      this.watchers[watchPath] = null;
    }
  }
}
