const fs = require('fs');
const { pathExists } = require('./filesystem');

const upadateFile = (path, content) => {
  if (!path) {
    throw new Error('File path is required');
  }

  // check if file exists
  if (!pathExists(path)) {
    throw new Error('File does not exist');
  }

  // now update the file
  return fs.writeFileSync(path, String(content), 'utf8');
};

module.exports = upadateFile;
