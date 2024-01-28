import * as fs from "@mongez/fs";
import concatRoute from "./util/concat-route";

export default function deleteFile(path: string) {

    if (!path) {
        return {
            status: 400,
            message: "File path is required",
        };
    }

    // check if file exists
    if (!fs.fileExists(path)) {
        return {
            status: 400,
            message: "File does not exist",
        };
    }

    // now delete the file
    try {
        fs.removePath(path);
    } catch(err) {
        return {
            status: 500,
            message: err.message,
        };
    }

    // return the file as node
    return {
        status: 201,
        message: `File deleted: ${path}`,
    };
}