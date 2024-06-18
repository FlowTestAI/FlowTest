const fs = require('fs');
const path = require('path');

/**
 * Determine if the given path is directory
 */
const isDirectory = (path) => {
  try {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
};

/**
 * Determine if the given path exists
 */
const pathExists = (path) => {
  try {
    fs.accessSync(path);
    return true;
  } catch (error) {
    return false;
  }
};

const getSubdirectoriesFromRoot = (rootPath, pathname) => {
  // convert to unix style path
  pathname = slash(pathname);
  rootPath = slash(rootPath);

  const relativePath = path.relative(rootPath, pathname);
  return relativePath ? relativePath.split(path.sep) : [];
};

const getDirectoryName = (pathname) => {
  // convert to unix style path
  pathname = slash(pathname);

  return path.dirname(pathname);
};

const isWindowsOS = () => {
  return process.platform === 'win32';
};

const isMacOS = () => {
  return process.platform === 'darwin';
};

const PATH_SEPARATOR = isWindowsOS() ? '\\' : '/';

const slash = (path) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
};

module.exports = {
  isDirectory,
  pathExists,
  getSubdirectoriesFromRoot,
  getDirectoryName,
  isMacOS,
  PATH_SEPARATOR,
};
