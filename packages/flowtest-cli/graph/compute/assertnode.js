const AssertOperators = require('../constants/assertOperators');
const { computeNodeVariable } = require('./utils');
const Node = require('./node');
const chalk = require('chalk');

class assertNode extends Node {
  constructor(operator, variables, prevNodeOutputData, envVariables, logs) {
    super('assertNode');
    this.operator = operator;
    this.variables = variables;
    this.prevNodeOutputData = prevNodeOutputData;
    this.logs = logs;
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
      throw 'Operator undefined';
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
    if (operator == AssertOperators.isEqualTo) {
      return var1 === var2;
    } else if (operator == AssertOperators.isNotEqualTo) {
      return var1 != var2;
    } else if (operator == AssertOperators.isGreaterThan) {
      return var1 > var2;
    } else if (operator == AssertOperators.isLessThan) {
      return var1 < var2;
    } else {
      throw 'Operator unrecognized';
    }
  }
}

module.exports = assertNode;
