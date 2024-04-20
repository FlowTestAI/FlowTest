const fs = require('fs');
const { isDirectory } = require('./filesystem');

const deleteDirectory = (path) => {
  if (!path) {
    throw new Error('Directory path is required');
  }

  // check if the directory exists
  if (!isDirectory(path)) {
    throw new Error('Path is not a directory');
  }

  // now delete the directory
  return fs.rmSync(path, { recursive: true, force: true });
};

module.exports = deleteDirectory;
