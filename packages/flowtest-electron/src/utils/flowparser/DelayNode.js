const { Node } = require('./Node');

class DelayNode extends Node {
  constructor() {
    super('delayNode');
  }

  serialize(id, data, metadata) {
    return {
      id,
      type: 'delayNode',
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
  DelayNode,
};
