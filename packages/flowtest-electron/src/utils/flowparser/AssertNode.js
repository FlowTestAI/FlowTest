const { Node } = require('./Node');

class AssertNode extends Node {
  constructor() {
    super('assertNode');
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
  AssertNode,
};
