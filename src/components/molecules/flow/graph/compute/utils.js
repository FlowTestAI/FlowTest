export const computeNodeVariable = (variable, prevNodeOutputData) => {
  if (variable.type.toLowerCase() === 'string') {
    return variable.value.toString();
  }

  if (variable.type.toLowerCase() === 'number') {
    return Number(variable.value);
  }

  if (variable.type.toLowerCase() === 'boolean') {
    return Boolean(variable.value);
  }

  if (variable.type.toLowerCase() === 'now') {
    return Date.now();
  }

  if (variable.type.toLowerCase() === 'select') {
    try {
      if (prevNodeOutputData == undefined || Object.keys(prevNodeOutputData).length === 0) {
        console.debug(
          `Cannot evaluate variable ${variable} as previous node output data ${JSON.stringify(prevNodeOutputData)} is empty`,
        );
        throw Error(`Cannot evaluate variable ${variable.value}`);
      }
      const jsonTree = variable.value.split('.');
      const getVal = (parent, pos) => {
        if (pos == jsonTree.length) {
          return parent;
        }
        const key = jsonTree[pos];
        if (key == '') {
          return parent;
        }

        return getVal(parent[key], pos + 1);
      };
      const result = getVal(prevNodeOutputData, 0);
      if (result == undefined) {
        console.debug(
          `Cannot evaluate variable ${JSON.stringify(variable)} as previous node output data ${JSON.stringify(prevNodeOutputData)} did not contain the variable`,
        );
        throw Error(`Cannot evaluate variable ${variable.value}`);
      }
      return result;
    } catch (error) {
      throw Error(`Cannot evaluate variable ${variable.value}`);
    }
  }
};

export const computeNodeVariables = (variables, prevNodeOutputData) => {
  const evalVariables = {};
  if (variables) {
    Object.entries(variables).map(([vname, variable]) => {
      evalVariables[vname] = computeNodeVariable(variable, prevNodeOutputData);
    });
  }
  return evalVariables;
};

export const computeVariables = (str, variablesDict) => {
  const regex = /\{\{(.+)\}\}/;
  const foundRegex = regex.exec(str);
  if (foundRegex) {
    const match = str.match(/{{([^}]+)}}/);
    if (variablesDict) {
      if (Object.prototype.hasOwnProperty.call(variablesDict, match[1])) {
        const varValue = variablesDict[`${match[1]}`];
        return computeVariables(str.replaceAll(match[0], varValue), variablesDict);
      } else {
        throw Error(`Cannot find value of variable ${match[1]}`);
      }
    } else {
      throw Error(`Cannot compute variable ${match[1]} as dict is empty`);
    }
  } else {
    return str;
  }
};
