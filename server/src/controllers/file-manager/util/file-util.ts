import * as fs from "fs";

/**
 * Determine if the given path is directory
 */
 export function isDirectory(path: string) {
    try {
      return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    } catch (e) {
      // lstatSync throws an error if path doesn't exist
      return false;
    }
}

/**
 * Determine if the given path exists
 */
 export function pathExists(path: string) {
    try {
      fs.accessSync(path);
      return true;
    } catch (error) {
      return false;
    }
  }