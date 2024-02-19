import * as fs from 'fs';
import concatRoute from './util/concat-route';
import { pathExists } from './util/file-util';

export default function upadateFile(path: string, content: string) {
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

  // now update the file
  try {
    fs.writeFileSync(path, String(content), 'utf8');
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }

  return {
    status: 200,
    message: `File updated: ${path}`,
  };
}
