import path from 'path';
import platform from 'platform';

export const getSubdirectoriesFromRoot = (rootPath: string, pathname: string) => {
  // convert to unix style path
  pathname = slash(pathname);
  rootPath = slash(rootPath);

  const relativePath = path.relative(rootPath, pathname);
  return relativePath ? relativePath.split(path.sep) : [];
};

export const getDirectoryName = (pathname: string) => {
  // convert to unix style path
  pathname = slash(pathname);

  return path.dirname(pathname);
};

export const isWindowsOS = () => {
  const os = platform.os;
  const osFamily = os.family.toLowerCase();

  return osFamily.includes('windows');
};

export const isMacOS = () => {
  const os = platform.os;
  const osFamily = os.family.toLowerCase();

  return osFamily.includes('os x');
};

export const slash = (path: string) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
};

export const PATH_SEPARATOR = isWindowsOS() ? '\\' : '/';
