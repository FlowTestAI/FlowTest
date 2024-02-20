const createDirectory = require('../../src/utils/filemanager/createdirectory');
const deleteDirectory = require('../../src/utils/filemanager/deletedirectory');
const { concatRoute } = require('../../src/utils/filemanager/filesystem');

const DIRECTORY_NAME = 'testDir';

describe('file-manager', () => {
  it('should create and delete directory', async () => {
    let result = createDirectory(DIRECTORY_NAME, __dirname);
    expect(result).toEqual(concatRoute(__dirname, DIRECTORY_NAME));

    // directory already exists
    expect(() => {
      createDirectory(DIRECTORY_NAME, __dirname);
    }).toThrow(Error);

    result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME));
    expect(result).toEqual(undefined);

    // directory doesn't exist
    expect(() => {
      deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME));
    }).toThrow(Error);
  });

  //   it('should create and delete files', async () => {
  //     let result = createDirectory(DIRECTORY_NAME, __dirname);
  //     expect(result.status).toEqual(201);

  //     result = createFile('test.flowtest.json', concatRoute(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
  //     expect(result.status).toEqual(201);

  //     // read file
  //     const rContent = readFile(concatRoute(__dirname, DIRECTORY_NAME, 'test.flowtest.json'));
  //     expect(rContent.status).toEqual(200);
  //     expect(rContent.content).toEqual('{"k1":"v1"}');

  //     // file already exists
  //     result = createFile('test.flowtest.json', concatRoute(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
  //     expect(result.status).toEqual(400);

  //     result = createFile('test1.flowtest.json', concatRoute(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
  //     expect(result.status).toEqual(201);

  //     // delete file
  //     result = deleteFile(concatRoute(__dirname, DIRECTORY_NAME, 'test1.flowtest.json'));
  //     expect(result.status).toEqual(200);

  //     // delete file: file no longer exists
  //     result = deleteFile(concatRoute(__dirname, DIRECTORY_NAME, 'test1.flowtest.json'));
  //     expect(result.status).toEqual(400);

  //     // delete directory
  //     result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME));
  //     expect(result.status).toEqual(200);
  //   });
});
