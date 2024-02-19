import createDirectory from '../src/controllers/file-manager/create-directory';
import createFile from '../src/controllers/file-manager/create-file';
import deleteDirectory from '../src/controllers/file-manager/delete-directory';
import deleteFile from '../src/controllers/file-manager/delete-file';
import readFile from '../src/controllers/file-manager/read-file';
import concatRoute from '../src/controllers/file-manager/util/concat-route';

const DIRECTORY_NAME = 'testDir';

describe('file-manager', () => {
  it('should create and delete directory', async () => {
    let result = createDirectory(DIRECTORY_NAME, __dirname);
    expect(result.status).toEqual(201);

    // directory already exists
    result = createDirectory(DIRECTORY_NAME, __dirname);
    expect(result.status).toEqual(400);

    result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME));
    expect(result.status).toEqual(200);

    // directory doesn't exist
    result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME));
    expect(result.status).toEqual(400);
  });

  it('should create and delete files', async () => {
    let result = createDirectory(DIRECTORY_NAME, __dirname);
    expect(result.status).toEqual(201);

    result = createFile('test.flowtest.json', concatRoute(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
    expect(result.status).toEqual(201);

    // read file
    const rContent = readFile(concatRoute(__dirname, DIRECTORY_NAME, 'test.flowtest.json'));
    expect(rContent.status).toEqual(200);
    expect(rContent.content).toEqual('{"k1":"v1"}');

    // file already exists
    result = createFile('test.flowtest.json', concatRoute(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
    expect(result.status).toEqual(400);

    result = createFile('test1.flowtest.json', concatRoute(__dirname, DIRECTORY_NAME), '{"k1":"v1"}');
    expect(result.status).toEqual(201);

    // delete file
    result = deleteFile(concatRoute(__dirname, DIRECTORY_NAME, 'test1.flowtest.json'));
    expect(result.status).toEqual(200);

    // delete file: file no longer exists
    result = deleteFile(concatRoute(__dirname, DIRECTORY_NAME, 'test1.flowtest.json'));
    expect(result.status).toEqual(400);

    // delete directory
    result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME));
    expect(result.status).toEqual(200);
  });
});
