import { computeVariables } from './utils';
import Node from './node';
import { LogLevel } from '../GraphLogger';

class authNode extends Node {
  constructor(nodeData, envVariables, logger) {
    super('authNode');
    (this.nodeData = nodeData), (this.envVariables = envVariables);
    this.logger = logger;
  }

  evaluate() {
    console.log('Evaluating an auth node');
    if (this.nodeData.type === 'basic-auth') {
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'Basic Authentication' } });
      const username = computeVariables(this.nodeData.username, this.envVariables);
      const password = computeVariables(this.nodeData.password, this.envVariables);

      return {
        type: 'basic-auth',
        username,
        password,
      };
    } else if (this.nodeData.type === 'bearer-token') {
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'Bearer Token' } });
      const token = computeVariables(this.nodeData.token, this.envVariables);
      return {
        type: 'bearer-token',
        token,
      };
    } else if (this.nodeData.type === 'no-auth') {
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'No Authentication' } });
      return {
        type: 'no-auth',
      };
    } else {
      throw Error(`auth type: ${this.nodeData.type} is not valid`);
    }
  }
}

export default authNode;
