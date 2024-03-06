const computeNodeVariable = (variable, prevNodeOutputData) => {
  if (variable.type.toLowerCase() === 'string') {
    return variable.value;
  }

  if (variable.type.toLowerCase() === 'number') {
    return variable.value;
  }

  if (variable.type.toLowerCase() === 'bool') {
    return Boolean(variable.value);
  }

  if (variable.type.toLowerCase() === 'select') {
    try {
      if (prevNodeOutputData == undefined || Object.keys(prevNodeOutputData).length === 0) {
        console.debug(
          `Cannot evaluate variable ${variable} as previous node output data ${JSON.stringify(prevNodeOutputData)} is empty`,
        );
        throw `Cannot evaluate variable ${variable.value}`;
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
        throw `Cannot evaluate variable ${variable.value}`;
      }
      return result;
    } catch (error) {
      throw `Cannot evaluate variable ${variable.value}`;
    }
  }
};

export const computeNodeVariables = (variables, prevNodeOutputData) => {
  let evalVariables = {};
  Object.entries(variables).map(([vname, variable], index) => {
    evalVariables[vname] = computeNodeVariable(variable, prevNodeOutputData);
  });
  return evalVariables;
};
