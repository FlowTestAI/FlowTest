const fs = require('fs');
const { isDirectory, pathExists } = require('./filesystem');
const path = require('path');

const createDirectory = (name, basePath) => {
  // now validate the name and path
  if (!name) {
    throw new Error('Directory name is required');
  }

  if (!basePath) {
    throw new Error('Directory path is required');
  }

  // check if the directory exists
  if (!isDirectory(basePath)) {
    throw new Error('Path is not a directory');
  }

  // check if the directory already exists
  const directoryPath = path.join(basePath, name);

  if (isDirectory(directoryPath)) {
    throw new Error('The directory already exists');
  }

  // now create the directory
  return fs.mkdirSync(directoryPath, {
    mode: 0o777,
    recursive: true,
  });
};

module.exports = createDirectory;
