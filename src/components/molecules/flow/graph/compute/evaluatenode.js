import Operators from '../../constants/operators';
import { computeNodeVariables } from '../compute/utils';
import Node from './node';

class evaluateNode extends Node {
  constructor(operator, variables, prevNodeOutputData, logs) {
    super('evaluateNode');
    this.operator = operator;
    this.variables = variables;
    this.prevNodeOutputData = prevNodeOutputData;
    this.logs = logs;
  }

  evaluate() {
    console.log('Evaluating an evaluate node');
    const evalVariables = computeNodeVariables(this.variables, this.prevNodeOutputData);
    const var1 = evalVariables.var1;
    const var2 = evalVariables.var2;

    const operator = this.operator;
    if (operator == undefined) {
      throw 'Operator undefined';
    }
    this.logs.push(
      `Evaluate var1: ${JSON.stringify(var1)} of type: ${typeof var1}, var2: ${JSON.stringify(var2)} of type: ${typeof var2} with operator: ${operator}`,
    );
    if (operator == Operators.isEqualTo) {
      return var1 === var2;
    } else if (operator == Operators.isNotEqualTo) {
      return var1 != var2;
    } else if (operator == Operators.isGreaterThan) {
      return var1 > var2;
    } else if (operator == Operators.isLessThan) {
      return var1 < var2;
    }
  }
}

export default evaluateNode;
