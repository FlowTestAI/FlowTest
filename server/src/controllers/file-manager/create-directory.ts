import * as fs from "@mongez/fs";
import concatRoute from "./util/concat-route";

export default function createDirectory(name: string, path: string) {

    // now validate the name and path
    if (!name) {
        return {
            status: 400,
            message: "Directory name is required",
        };
    }

    if (!path) {
        return {
            status: 400,
            message: "Directory path is required",
        };
    }

    // check if the directory exists
    if (!fs.isDirectory(path)) {
        return {
            status: 400,
            message: "Path is not a directory",
        };
    }

    // check if the directory already exists
    const directoryPath = concatRoute(path, name);

    if (fs.isDirectory(directoryPath)) {
        return {
            status: 400,
            message: "The directory already exists",
        };
    }

    // now create the directory
    try {
        fs.makeDirectory(directoryPath);
    } catch(err) {
        return {
            status: 500,
            message: err.message,
        };
    }

    // return the directory as node
    return {
        status: 201,
        message: `Directory created: ${directoryPath}`,
    };
}