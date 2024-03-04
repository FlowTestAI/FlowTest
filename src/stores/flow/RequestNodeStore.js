import { create } from 'zustand';
import { getDefaultValue } from 'utils/common';

/**
 * variablesDataType
 * {
 *    id: { // essentially the name of the variable
 *      type: string, // type of data String | Boolean | Number
 *      value: string // value for each type, will be default first
 *    },
 * }
 */
export const useRequestNodeStore = create((set, get) => ({
  variablesData: [],
  bodyData: {},
  addToVariablesData: (variableName, variableType) => {
    console.log(`\n \n ${variableName} && ${variableType}`);

    let newVariableData = {};
    newVariableData[variableName] = {
      type: variableType,
      value: getDefaultValue(variableType),
    };
    set((state) => ({ variablesData: [...state.variablesData, newVariableData] }));
  },
  deleteFromVariablesData: (variableName) => {
    console.log(`\n \n ${variableName}`);
    set((state) => {
      const variables = state.variablesData;
      const updatedVariablesData = variables.filter((variableData) => {
        if (Object.keys(variableData)[0] !== variableName) {
          return variableData;
        }
      });
      return { variablesData: updatedVariablesData };
    });
  },
  updateVariableValue: (variableName, variableValueToUpdate) => {
    console.log(`\n \n ${variableName}`);
    set((state) => {
      const variables = state.variablesData;
      const updatedVariablesData = variables.filter((variableData) => {
        if (Object.keys(variableData)[0] === variableName) {
          let newUpdateVariable = {};
          newUpdateVariable[variableName] = variableValueToUpdate;
          return newUpdateVariable;
        }
        return variableData;
      });
      return { variablesData: updatedVariablesData };
    });
  },
}));
