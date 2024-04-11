const { Node } = require('./Node');

class EvaluateNode extends Node {
  constructor() {
    super('evaluateNode');
  }

  serialize(id, data, metadata) {
    return {
      id,
      type: 'evaluateNode',
      data,
      ...metadata,
    };
  }

  deserialize(node) {
    const id = node.id;
    const data = node.data;
    delete node.id;
    delete node.data;
    const metadata = node;

    return {
      id,
      data,
      metadata,
    };
  }
}

module.exports = {
  EvaluateNode,
};
