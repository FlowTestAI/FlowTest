const Graph1 = require('../Graph');
const Node = require('./node');

class complexNode extends Node {
  constructor(nodes, edges, startTime, timeout, initialEnvVars, initialLogs) {
    super('complexNode');
    this.internalGraph = new Graph1(nodes, edges, startTime, timeout, initialEnvVars, initialLogs);
  }

  async evaluate() {
    //console.log('Evaluating a complex node (nested graph):');
    return this.internalGraph.run();
  }
}

module.exports = complexNode;
