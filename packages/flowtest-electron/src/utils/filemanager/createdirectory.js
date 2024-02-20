const fs = require('fs');
const { isDirectory, concatRoute, pathExists } = require('./filesystem');

const createDirectory = (name, path) => {
  // now validate the name and path
  if (!name) {
    throw new Error('Directory name is required');
  }

  if (!path) {
    throw new Error('Directory path is required');
  }

  // check if the directory exists
  if (!isDirectory(path)) {
    throw new Error('Path is not a directory');
  }

  // check if the directory already exists
  const directoryPath = concatRoute(path, name);

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
