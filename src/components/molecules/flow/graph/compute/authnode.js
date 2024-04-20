import { computeVariables } from './utils';
import Node from './node';

class authNode extends Node {
  constructor(auth, envVariables) {
    super('authNode');
    (this.auth = auth), (this.envVariables = envVariables);
  }

  evaluate() {
    console.log('Evaluating an auth node');
    if (this.auth.type === 'basic-auth') {
      this.auth.username = computeVariables(this.auth.username, this.envVariables);
      this.auth.password = computeVariables(this.auth.password, this.envVariables);

      return this.auth;
    } else if (this.auth.type === 'no-auth') {
      return this.auth;
    } else {
      throw Error(`auth type: ${this.auth.type} is not valid`);
    }
  }
}

export default authNode;
