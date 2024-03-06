import Operators from '../../constants/operators';
import { computeNodeVariables } from './utils';

export const computeEvaluateNode = (node, prevNodeOutputData, logs) => {
  const evalVariables = computeNodeVariables(node.data.variables, prevNodeOutputData);
  const var1 = evalVariables.var1;
  const var2 = evalVariables.var2;

  const operator = node.data.operator;
  if (operator == undefined) {
    throw 'Operator undefined';
  }
  logs.push(
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
};
