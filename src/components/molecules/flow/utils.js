import { isEqual } from 'lodash';

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

export const findNodeInCollection = (nodes, node) => {
  return nodes.find(
    (n) =>
      n.description === node.description &&
      n.operationId === node.operationId &&
      n.requestType === node.requestType &&
      isEqual(n.tags, node.tags),
  );
};
