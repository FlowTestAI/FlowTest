const { Node } = require('./Node');

class RequestNode extends Node {
  constructor() {
    super('requestNode');
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
  RequestNode,
};
