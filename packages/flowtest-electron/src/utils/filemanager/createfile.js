const fs = require('fs');
const dpath = require('path');
const { isDirectory, pathExists } = require('./filesystem');

const createFile = (name, path, content) => {
  // now validate the name and path
  if (!name) {
    throw new Error('File name is required');
  }

  if (!path) {
    throw new Error('Directory path is required');
  }

  // check if the directory exists
  if (!isDirectory(path)) {
    throw new Error('Path is not a directory');
  }

  // check if the file already exists
  const filePath = dpath.join(path, name);

  if (pathExists(filePath)) {
    throw new Error(`File already exists ${filePath}`);
  }

  // now create the file
  return fs.writeFileSync(filePath, String(content), 'utf8');
};

module.exports = createFile;
