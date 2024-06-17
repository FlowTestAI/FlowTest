const AssertOperators = require('../constants/assertOperators');
const { computeNodeVariable } = require('./utils');
const Node = require('./node');
const chalk = require('chalk');
const { LogLevel } = require('../GraphLogger');

class assertNode extends Node {
  constructor(operator, variables, prevNodeOutputData, envVariables, logger) {
    super('assertNode');
    this.operator = operator;
    this.variables = variables;
    this.prevNodeOutputData = prevNodeOutputData;
    this.logger = logger;
    this.envVariables = envVariables;
  }

  getVariableValue(variable) {
    if (variable.type.toLowerCase() === 'variable') {
      if (Object.prototype.hasOwnProperty.call(this.envVariables, variable.value)) {
        return this.envVariables[variable.value];
      } else {
        throw Error(`Cannot find value of variable ${variable.value}`);
      }
    } else {
      return computeNodeVariable(variable, this.prevNodeOutputData);
    }
  }

  evaluate() {
    //console.log('Evaluating an assert node');
    const var1 = this.getVariableValue(this.variables.var1);
    const var2 = this.getVariableValue(this.variables.var2);

    const operator = this.operator;
    if (operator == undefined) {
      throw Error('Operator undefined');
    }
    // this.logs.push(
    //   `Assert var1: ${JSON.stringify(var1)} of type: ${typeof var1}, var2: ${JSON.stringify(var2)} of type: ${typeof var2} with operator: ${operator}`,
    // );
    console.log(
      'Assert Node: ' +
        chalk.green(
          `Assert var1: ${JSON.stringify(var1)} of type: ${typeof var1}, var2: ${JSON.stringify(var2)} of type: ${typeof var2} with operator: ${operator}`,
        ),
    );
    let result;
    switch (operator) {
      case AssertOperators.isEqualTo:
        result = var1 === var2;
        break;
      case AssertOperators.isNotEqualTo:
        result = var1 != var2;
        break;
      case AssertOperators.isGreaterThan:
        result = var1 > var2;
        break;
      case AssertOperators.isLessThan:
        result = var1 < var2;
        break;
      default:
        throw Error('Unsupported operator');
    }
    this.logger.add(LogLevel.INFO, '', { type: 'assertNode', data: { var1, var2, operator, result } });

    return result;
  }
}

module.exports = assertNode;
