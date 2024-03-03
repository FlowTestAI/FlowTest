function trim(text) {
  return String(text).replace(/^\/|\/$/g, '');
}

/**
 * Concatenate the given paths to one single path
 *
 * @param   {...string} segments
 * @returns {string}
 */
const concatRoute = (...segments) => {
  let path = segments
    .filter((value) => value && String(value).length > 0)
    .map((segment) => '/' + trim(segment))
    .join('');

  return '/' + trim(path.replace(/(\/)+/g, '/'));
};

export default concatRoute;
