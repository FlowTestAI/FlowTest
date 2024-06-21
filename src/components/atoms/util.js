import _, { isEqual, map } from 'lodash';

export const compare = (a, b) => {
  const result = {
    different: [],
    missing_from_first: [],
    missing_from_second: [],
  };

  _.reduce(
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
            var deeper = compare(a[key], b[key]);
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

  _.reduce(
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

export const isSaveNeeded = (flowData, flowDataDraft) => {
  if (flowData.nodes.length != flowDataDraft.nodes.length) {
    console.log('Detected unsaved changes: node count');
    return true;
  }

  if (flowData.edges.length != flowDataDraft.edges.length) {
    console.log('Detected unsaved changes: edges count');
    return true;
  }

  const unwrapEdge = function ({ source, sourceHandle, target, targetHandle }) {
    return { source, sourceHandle, target, targetHandle };
  };

  const edges = flowData.edges.map((e) => unwrapEdge(e));
  const edgesDraft = flowDataDraft.edges.map((e) => unwrapEdge(e));

  if (!isEqual(edges, edgesDraft)) {
    console.log('Detected unsaved changes: ', compare(edges, edgesDraft));
    return true;
  }

  const unwrapNode = function ({ id, type, data, position }) {
    return { id, type, data, position };
  };

  const nodes = flowData.nodes.map((node) => {
    if (node.type === 'outputNode' && node.data.output) {
      const { ['output']: _, ...data } = node.data;
      return unwrapNode({
        ...node,
        data,
      });
    }
    return unwrapNode(node);
  });
  const nodesDraft = flowDataDraft.nodes.map((node) => {
    if (node.type === 'outputNode' && node.data.output) {
      const { ['output']: _, ...data } = node.data;
      return unwrapNode({
        ...node,
        data,
      });
    }
    return unwrapNode(node);
  });

  if (!isEqual(nodes, nodesDraft)) {
    console.log('Detected unsaved changes: ', compare(nodes, nodesDraft));
    return true;
  }

  return false;
};
