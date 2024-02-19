import * as fs from 'fs';
import { isDirectory } from './util/file-util';

export default function deleteDirectory(path: string) {
  if (!path) {
    return {
      status: 400,
      message: 'Directory path is required',
    };
  }

  // check if the directory exists
  if (!isDirectory(path)) {
    return {
      status: 400,
      message: 'Path is not a directory',
    };
  }

  // now delete the directory
  try {
    fs.rmSync(path, { recursive: true, force: true });
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }

  // return the directory as node
  return {
    status: 200,
    message: `Directory deleted: ${path}`,
  };
}
