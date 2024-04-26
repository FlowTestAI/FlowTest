const { computeNodeVariable } = require('./utils');
const Node = require('./node');
const EvaluateOperators = require('../constants/evaluateOperators');

class setVarNode extends Node {
  constructor(nodeData, prevNodeOutputData, envVariables) {
    super('setVarNode');
    this.nodeData = nodeData;
    this.prevNodeOutputData = prevNodeOutputData;
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
    //console.log('Evaluating set variable node');
    if (this.nodeData.variable) {
      if (this.nodeData.variable.name && this.nodeData.variable.name.trim() != '') {
        const vName = this.nodeData.variable.name;
        const vType = this.nodeData.variable.type.trim();
        if (['String', 'Number', 'Boolean', 'Now', 'Select'].includes(vType)) {
          const value = computeNodeVariable(this.nodeData.variable, this.prevNodeOutputData);
          return {
            [vName]: value,
          };
        } else if (vType === 'Expression') {
          const variables = this.nodeData.variable.value.variables;
          if (variables && variables.var1 && variables.var2) {
            const var1 = this.getVariableValue(this.nodeData.variable.value.variables.var1);
            const var2 = this.getVariableValue(this.nodeData.variable.value.variables.var2);

            const operator = this.nodeData.variable.value.operator;
            if (operator == undefined) {
              throw 'Operator undefined';
            }
            if (operator == EvaluateOperators.Add) {
              if (typeof var1 !== 'number' || typeof var2 !== 'number') {
                throw Error(`Cannot perform ${typeof var1} + ${typeof var2}`);
              }
              return {
                [vName]: var1 + var2,
              };
            } else if (operator == EvaluateOperators.Subtract) {
              if (typeof var1 !== 'number' || typeof var2 !== 'number') {
                throw Error(`Cannot perform ${typeof var1} + ${typeof var2}`);
              }
              return {
                [vName]: var1 - var2,
              };
            }
          }
        }
      }
    }
  }
}

module.exports = setVarNode;
