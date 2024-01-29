import * as fs from "@mongez/fs";
import concatRoute from "./util/concat-route";

/**
 * File Manager node is the primary data structure for the File Manager.
 * It can be a directory or a file.
 * It contains the following properties:
 */
export type Node = {
    /**
     * Node Name
     */
    name: string;
    /**
     * Node full path to root
     */
    path: string;
    /**
     * Is node directory
     */
    isDirectory: boolean;
    /**
     * Node children
     * This should be present (event with empty array) if the node is directory
     */
    children?: Node[];
    /**
     * Get children directories
     */
    directories?: Node[];
    /**
     * Get children files
     */
    files?: Node[];
};

export default function makeNode(name: string, path: string, children?: string[]): Node {
    const node: Node = {
        path,
        name,
        isDirectory: fs.isDirectory(concatRoute(path, name)),
    };
    
    if (node.isDirectory) {
        node.children = (children || []).map((child) =>
            makeNode(child, concatRoute(path, name))
        );
    }

    return node;
}