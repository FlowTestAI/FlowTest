const fs = require('fs');
const { pathExists } = require('./filesystem');

const readFile = (path) => {
  if (!path) {
    throw new Error('File path is required');
  }

  // check if file exists
  if (!pathExists(path)) {
    throw new Error('File does not exist');
  }

  // now delete the file
  return fs.readFileSync(path, 'utf8');
};

module.exports = readFile;
