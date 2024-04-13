import { isEqual, reduce, map } from 'lodash';

export const orderNodesByTags = (nodes) => {
  const result = {};
  if (nodes) {
    nodes.map((node) => {
      node.tags.map((tag) => {
        if (!result[tag]) {
          result[tag] = [];
        }
        result[tag].push(node);
      });
    });
  }
  return result;
};

export const compareTwoObjects = function (a, b) {
  var result = {
    different: [],
    missing_from_first: [],
    missing_from_second: [],
  };

  reduce(
    a,
    function (result, value, key) {
      if (Object.prototype.hasOwnProperty.call(b, key)) {
        if (isEqual(value, b[key])) {
          return result;
        } else {
          if (typeof a[key] != typeof {} || typeof b[key] != typeof {}) {
            //dead end.
            result.different.push(key);
            return result;
          } else {
            var deeper = compareTwoObjects(a[key], b[key]);
            result.different = result.different.concat(
              map(deeper.different, (sub_path) => {
                return key + '.' + sub_path;
              }),
            );

            result.missing_from_second = result.missing_from_second.concat(
              map(deeper.missing_from_second, (sub_path) => {
                return key + '.' + sub_path;
              }),
            );

            result.missing_from_first = result.missing_from_first.concat(
              map(deeper.missing_from_first, (sub_path) => {
                return key + '.' + sub_path;
              }),
            );
            return result;
          }
        }
      } else {
        result.missing_from_second.push(key);
        return result;
      }
    },
    result,
  );

  reduce(
    b,
    function (result, value, key) {
      if (Object.prototype.hasOwnProperty.call(a, key)) {
        return result;
      } else {
        result.missing_from_first.push(key);
        return result;
      }
    },
    result,
  );

  return result;
};

export const initFlowData = {
  nodes: [
    {
      id: '0',
      type: 'startNode',
      position: {
        x: 150,
        y: 150,
      },
      deletable: false,
      width: 90,
      height: 60,
    },
    {
      id: '1',
      type: 'authNode',
      data: {},
      position: {
        x: 400,
        y: 150,
      },
      width: 147,
      height: 107,
    },
  ],
  edges: [
    {
      id: 'reactflow__edge-0-1',
      source: '0',
      sourceHandle: null,
      target: '1',
      targetHandle: null,
      type: 'buttonedge',
    },
  ],
};
