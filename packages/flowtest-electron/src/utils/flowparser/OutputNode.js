const { Node } = require('./Node');

class OutputNode extends Node {
  constructor() {
    super('outputNode');
  }

  serialize(id, data, metadata) {
    return {
      id,
      type: this.type,
      data,
      ...metadata,
    };
  }

  deserialize(node) {
    const id = node.id;
    const { ['output']: _, ...data } = node.data;
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
  OutputNode,
};
