const { Node } = require('./Node');

class StartNode extends Node {
  constructor() {
    super('startNode');
  }

  serialize(id, data, metadata) {
    return {
      id,
      ...metadata,
    };
  }

  deserialize(node) {
    const id = node.id;
    delete node.id;
    const metadata = node;

    return {
      id,
      metadata,
    };
  }
}

module.exports = {
  StartNode,
};
