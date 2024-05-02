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
  return Object.keys(result)
    .sort()
    .reduce((obj, key) => {
      obj[key] = result[key];
      return obj;
    }, {});
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
      description: 'Define authentication for the requests',
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
  viewport: { x: 0, y: 0, zoom: 1 },
};

export const timeoutForGraphRun = [
  { value: '300000', label: '5 minutes' },
  { value: '600000', label: '10 minutes' },
  { value: '900000', label: '15 minutes' },
  { value: '1800000', label: '30 minutes' },
];
