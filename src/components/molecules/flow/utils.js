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
