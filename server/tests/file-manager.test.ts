import * as fs from "@mongez/fs";
import createDirectory from "../src/controllers/file-manager/create-directory";
import createFile from "../src/controllers/file-manager/create-file";
import deleteDirectory from "../src/controllers/file-manager/delete-directory";
import deleteFile from "../src/controllers/file-manager/delete-file";
import concatRoute from "../src/controllers/file-manager/util/concat-route";

describe("file-manager", () => {
    it("should create and delete directory", async () => {
        const DIRECTORY_NAME = "testDir"

        let result = createDirectory(DIRECTORY_NAME, __dirname)
        expect(result.status).toEqual(201) 

        // directory already exists
        result = createDirectory(DIRECTORY_NAME, __dirname)
        expect(result.status).toEqual(400) 

        result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME))
        expect(result.status).toEqual(200) 
    });

    it("should create and delete files", async () => {
        const DIRECTORY_NAME = "testFile"

        let result = createDirectory(DIRECTORY_NAME, __dirname)
        expect(result.status).toEqual(201) 

        result = createFile("test.flowtest.json", concatRoute(__dirname, DIRECTORY_NAME), "{\"k1\":\"v1\"}")
        expect(result.status).toEqual(201)
        
        // file already exists
        result = createFile("test.flowtest.json", concatRoute(__dirname, DIRECTORY_NAME), "{\"k1\":\"v1\"}")
        expect(result.status).toEqual(400)

        // delete file
        result = createFile("test1.flowtest.json", concatRoute(__dirname, DIRECTORY_NAME), "{\"k1\":\"v1\"}")
        expect(result.status).toEqual(201)

        result = deleteFile(concatRoute(__dirname, DIRECTORY_NAME, "test1.flowtest.json"))
        expect(result.status).toEqual(201)

        // delete directory
        result = deleteDirectory(concatRoute(__dirname, DIRECTORY_NAME))
        expect(result.status).toEqual(200) 
    });
});