import * as fs from 'fs';
import concatRoute from './util/concat-route';
import { isDirectory, pathExists } from './util/file-util';

export default function createFile(name: string, path: string, content: string) {
  // now validate the name and path
  if (!name) {
    return {
      status: 400,
      message: 'File name is required',
    };
  }

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

  // check if the file already exists
  const filePath = concatRoute(path, name);

  if (pathExists(filePath)) {
    return {
      status: 400,
      message: 'File already exists',
    };
  }

  // now create the file
  try {
    fs.writeFileSync(filePath, String(content), 'utf8');
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }

  // return the file as node
  return {
    status: 201,
    message: `File created: ${filePath}`,
  };
}
