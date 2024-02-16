function trim(text: string): string {
    return String(text).replace(/^\/|\/$/g, "");
}
  
/**
 * Concatenate the given paths to one single path
 *
 * @param   {...string} segments
 * @returns {string}
 */
export default function concatRoute(...segments: string[]): string {
    let path: string = segments
        .filter((value) => value && String(value).length > 0)
        .map((segment) => "/" + trim(segment))
        .join("");

    return "/" + trim(path.replace(/(\/)+/g, "/"));
}