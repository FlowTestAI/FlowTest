const { computeVariables } = require('./utils');
const Node = require('./node');
const chalk = require('chalk');
const { LogLevel } = require('../GraphLogger');

class authNode extends Node {
  constructor(nodeData, envVariables, logger) {
    super('authNode');
    (this.nodeData = nodeData), (this.envVariables = envVariables);
    this.logger = logger;
  }

  evaluate() {
    //console.log('Evaluating an auth node');
    if (this.nodeData.type === 'basic-auth') {
      console.log(chalk.green(`   ✓ `) + chalk.dim('.....setting basic authentication'));
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'Basic Authentication' } });
      const username = computeVariables(this.nodeData.username, this.envVariables);
      const password = computeVariables(this.nodeData.password, this.envVariables);

      return {
        type: 'basic-auth',
        username,
        password,
      };
    } else if (this.auth.type === 'no-auth') {
      console.log(chalk.green(`   ✓ `) + chalk.dim('.....using no authentication'));
      this.logger.add(LogLevel.INFO, '', { type: 'authNode', data: { authType: 'No Authentication' } });
      return {
        type: 'no-auth',
      };
    } else {
      throw Error(`auth type: ${this.nodeData.type} is not valid`);
    }
  }
}

module.exports = authNode;
