import Graph1 from '../Graph';
import Node from './node';

class complexNode extends Node {
  constructor(nodes, edges, startTime, initialEnvVars, logger) {
    super('complexNode');
    this.internalGraph = new Graph1(nodes, edges, startTime, initialEnvVars, logger);
  }

  async evaluate() {
    console.log('Evaluating a complex node (nested graph):');
    return this.internalGraph.run();
  }
}

export default complexNode;
