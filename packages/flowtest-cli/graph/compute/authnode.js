const { computeVariables } = require('./utils');
const Node = require('./node');
const chalk = require('chalk');

class authNode extends Node {
  constructor(auth, envVariables) {
    super('authNode');
    (this.auth = auth), (this.envVariables = envVariables);
  }

  evaluate() {
    //console.log('Evaluating an auth node');
    if (this.auth.type === 'basic-auth') {
      console.log(chalk.green(`   ✓ `) + chalk.dim('.....setting basic authentication'));
      this.auth.username = computeVariables(this.auth.username, this.envVariables);
      this.auth.password = computeVariables(this.auth.password, this.envVariables);

      return this.auth;
    } else if (this.auth.type === 'no-auth') {
      console.log(chalk.green(`   ✓ `) + chalk.dim('.....using no authentication'));
      return this.auth;
    } else {
      throw Error(`auth type: ${this.auth.type} is not valid`);
    }
  }
}

module.exports = authNode;
