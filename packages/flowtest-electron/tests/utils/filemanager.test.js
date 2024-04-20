const createDirectory = require('../../src/utils/filemanager/createdirectory');
const deleteDirectory = require('../../src/utils/filemanager/deletedirectory');
const path = require('path');
const createFile = require('../../src/utils/filemanager/createfile');
const readFile = require('../../src/utils/filemanager/readfile');
const deleteFile = require('../../src/utils/filemanager/deletefile');
const { pathExists } = require('../../src/utils/filemanager/filesystem');

const DIRECTORY_NAME = 'testDir';

describe('file-manager', () => {
  it('should create and delete directory', async () => {
    let result = createDirectory(DIRECTORY_NAME, __dirname);
    expect(result).toEqual(path.join(__dirname, DIRECTORY_NAME));

    // directory already exists
    expect(() => {
      createDirectory(DIRECTORY_NAME, __dirname);
    }).toThrow(Error);

    deleteDirectory(path.join(__dirname, DIRECTORY_NAME));
    expect(pathExists(path.join(__dirname, DIRECTORY_NAME))).toEqual(false);

    // directory doesn't exist
    expect(() => {
      deleteDirectory(path.join(__dirname, DIRECTORY_NAME));
    }).toThrow(Error);
  });

  it('should create and delete files', async () => {
    let result = createDirectory(DIRECTORY_NAME, __dirname);
    expect(result).toEqual(path.join(__dirname, DIRECTORY_NAME));

    createFile('test.flow', path.join(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
    expect(pathExists(path.join(__dirname, DIRECTORY_NAME, 'test.flow'))).toEqual(true);

    // read file
    const rContent = readFile(path.join(__dirname, DIRECTORY_NAME, 'test.flow'));
    expect(rContent).toEqual('{"k1":"v1"}');

    // file already exists
    expect(() => {
      createFile('test.flow', path.join(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
    }).toThrow(Error);

    createFile('test1.flow', path.join(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
    expect(pathExists(path.join(__dirname, DIRECTORY_NAME, 'test1.flow'))).toEqual(true);

    // delete file
    deleteFile(path.join(__dirname, DIRECTORY_NAME, 'test1.flow'));
    expect(pathExists(path.join(__dirname, DIRECTORY_NAME, 'test1.flow'))).toEqual(false);

    // delete file: file no longer exists
    expect(() => {
      deleteFile(path.join(__dirname, DIRECTORY_NAME, 'test1.flow'));
    }).toThrow(Error);

    // delete directory
    deleteDirectory(path.join(__dirname, DIRECTORY_NAME));
    expect(pathExists(path.join(__dirname, DIRECTORY_NAME))).toEqual(false);
  });
});
