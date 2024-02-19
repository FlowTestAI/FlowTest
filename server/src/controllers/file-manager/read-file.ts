import * as fs from 'fs';
import { pathExists } from './util/file-util';

export default function readFile(path: string) {
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
    const fileContent = fs.readFileSync(path, 'utf8');
    return {
      status: 200,
      message: `File read: ${path}`,
      content: fileContent,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
}
