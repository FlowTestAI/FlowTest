import Graph1 from '../Graph';
import Node from './node';

class nestedFlowNode extends Node {
  constructor(nodes, edges, startTime, initialEnvVars, logger, collectionPath, timeout) {
    super('flowNode');
    this.internalGraph = new Graph1(nodes, edges, startTime, initialEnvVars, logger, collectionPath, timeout);
  }

  async evaluate() {
    console.log('Evaluating a complex node (nested graph):');
    return this.internalGraph.run();
  }
}

export default nestedFlowNode;
