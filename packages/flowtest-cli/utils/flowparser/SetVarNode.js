const { Node } = require('./Node');

class SetVarNode extends Node {
  constructor() {
    super('setVarNode');
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
  SetVarNode,
};
