const { Node } = require('./Node');

class ComplexNode extends Node {
  constructor() {
    super('complexNode');
  }

  serialize(id, data, metadata) {
    return {
      id,
      type: 'complexNode',
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
  ComplexNode,
};
