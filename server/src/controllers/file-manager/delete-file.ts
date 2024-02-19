import * as fs from 'fs';
import concatRoute from './util/concat-route';
import { pathExists } from './util/file-util';

export default function deleteFile(path: string) {
  if (!path) {
    return {
      status: 400,
      message: 'File path is required',
    };
  }

  // check if file exists
  if (!pathExists(path)) {
    return {
      status: 400,
      message: 'File does not exist',
    };
  }

  // now delete the file
  try {
    fs.rmSync(path, { recursive: true, force: true });
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }

  return {
    status: 200,
    message: `File deleted: ${path}`,
  };
}
