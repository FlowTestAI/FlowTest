import * as fs from "@mongez/fs";

export default function deleteDirectory(path: string) {

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

    // now create the directory
    try {
        fs.removeDirectory(path);
    } catch(err) {
        return {
            status: 500,
            message: err.message,
        };
    }

    // return the directory as node
    return {
        status: 200,
        message: `Directory deleted: ${path}`,
    };
}