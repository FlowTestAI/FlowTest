class Node {
  constructor(type) {
    this.type = type;
  }

  serialize(id, data, metadata) {
    throw new Error('Serialize method must be implemented by subclasses');
  }

  deserialize(node) {
    throw new Error('Deserialize method must be implemented by subclasses');
  }
}

module.exports = {
  Node,
};
