const fs = require('fs');
const platform = require('platform');

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

function trim(text) {
  return String(text).replace(/^\/|\/$/g, '');
}

/**
 * Concatenate the given paths to one single path
 *
 * @param   {...string} segments
 * @returns {string}
 */
const concatRoute = (...segments) => {
  let path = segments
    .filter((value) => value && String(value).length > 0)
    .map((segment) => '/' + trim(segment))
    .join('');

  return '/' + trim(path.replace(/(\/)+/g, '/'));
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
  const os = platform.os;
  const osFamily = os.family.toLowerCase();

  return osFamily.includes('windows');
};

const isMacOS = () => {
  const os = platform.os;
  const osFamily = os.family.toLowerCase();

  return osFamily.includes('os x');
};

const slash = (path) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
};

// const PATH_SEPARATOR = isWindowsOS() ? '\\' : '/';

module.exports = {
  isDirectory,
  pathExists,
  concatRoute,
  getSubdirectoriesFromRoot,
  getDirectoryName,
  isWindowsOS,
  isMacOS,
  slash,
};
