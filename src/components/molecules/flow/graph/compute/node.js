class Node {
  constructor(type) {
    this.type = type;
  }

  evaluate() {
    throw new Error('Evaluate method must be implemented by subclasses');
  }
}

export default Node;
