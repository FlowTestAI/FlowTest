import { computeVariables } from './utils';
import Node from './node';
import { LogLevel } from '../GraphLogger';

class authNode extends Node {
  constructor(auth, envVariables, logger) {
    super('authNode');
    (this.auth = auth), (this.envVariables = envVariables);
    this.logger = logger;
  }

  evaluate() {
    console.log('Evaluating an auth node');
    if (this.auth.type === 'basic-auth') {
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'Basic Authentication' } });
      this.auth.username = computeVariables(this.auth.username, this.envVariables);
      this.auth.password = computeVariables(this.auth.password, this.envVariables);

      return this.auth;
    } else if (this.auth.type === 'no-auth') {
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'No Authentication' } });
      return this.auth;
    } else {
      throw Error(`auth type: ${this.auth.type} is not valid`);
    }
  }
}

export default authNode;
