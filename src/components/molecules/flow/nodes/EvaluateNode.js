import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Operators from '../constants/operators';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ } from 'constants/Common';

const operatorMenu = (data) => {
  const [selectedOperatorValue, setSelectedOperatorValue] = useState(
    data.operator ? data.operator : CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value,
  );
  const handleOperatorSelection = (event) => {
    const selectedValue = event.target?.value;
    // ToDO: verify the behavior when use selects the default item
    if (selectedValue !== CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value) {
      data.operator = selectedValue;
      setSelectedOperatorValue(selectedValue);
    }
  };

  return (
    <div className='mb-4'>
      <select
        onChange={handleOperatorSelection}
        name='auth-type'
        default={selectedOperatorValue}
        className='w-full h-12 px-1 py-2 border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'
      >
        <option value={CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value}>
          {CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.displayValue}
        </option>
        <option value={Operators.isLessThan}>{Operators.isLessThan}</option>
        <option value={Operators.isGreaterThan}>{Operators.isGreaterThan}</option>
        <option value={Operators.isEqualTo}>{Operators.isEqualTo}</option>
        <option value={Operators.isNotEqualTo}>{Operators.isNotEqualTo}</option>
      </select>
    </div>
  );
};

// ToDo: refactor component parameters, make it more readable. vname and data are not suited
const variableElem = (data, varName) => {
  // default values
  if (!data.variables[varName]) {
    data.variables[varName] = {};
    data.variables[varName].type = 'String';
    data.variables[varName].value = '';
  }
  const dataVariables = data.variables;
  const [varType, setVarType] = useState(dataVariables[varName].type);
  const [inputType, setInputType] = useState(getInputType(dataVariables[varName].type));
  const [variableValue, setVariableValue] = useState(dataVariables[varName].value);

  const handleInputTypeSelection = (event) => {
    if (!data.variables[varName]) {
      data.variables[varName] = {};
    }
    const selectedValue = event.target?.value;
    data.variables[varName].type = selectedValue;
    switch (selectedValue) {
      case 'String':
        data.variables[varName].value = '';
        setVariableValue('');
        break;
      case 'Select':
        data.variables[varName].value = '';
        setVariableValue('');
        break;
      case 'Number':
        data.variables[varName].value = 0;
        setVariableValue(0);
        break;
      case 'Boolean':
        data.variables[varName].value = false;
        setVariableValue(false);
        break;
    }
    setVarType(selectedValue);
    setInputType(getInputType(selectedValue));
  };

  const handleBooleanValueSelection = (event) => {
    if (!data.variables[varName]) {
      data.variables[varName] = {};
    }
    const selectedValue = event.target?.value;
    data.variables[varName].value = selectedValue;
    setVariableValue(selectedValue);
  };

  return (
    <div className='flex items-center justify-center mb-4 text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
      {varType === 'Boolean' ? (
        <select
          onChange={handleBooleanValueSelection}
          name='boolean-val'
          className='nodrag h-12 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
          value={variableValue}
        >
          <option value='true'>True</option>
          <option value='false'>False</option>
        </select>
      ) : (
        <input
          id='outlined-adornment-weight'
          type={inputType}
          className='nodrag nowheel block h-12 w-full rounded-bl-md rounded-tl-md  p-2.5'
          name='variable-value'
          placeholder={varName}
          value={variableValue}
          onChange={(event) => {
            const updatedValue = event.target.value;
            if (!data.variables[varName]) {
              data.variables[varName] = {};
            }
            switch (varType) {
              case 'String':
                data.variables[varName].value = updatedValue.toString();
                setVariableValue(updatedValue.toString());
                break;
              case 'Select':
                data.variables[varName].value = updatedValue.toString();
                setVariableValue(updatedValue.toString());
                break;
              case 'Number':
                data.variables[varName].value = parseInt(updatedValue);
                setVariableValue(parseInt(updatedValue));
                break;
            }
          }}
        />
      )}

      <select
        onChange={handleInputTypeSelection}
        name='var-input-type'
        className='w-full h-8 p-0 px-1 border-l nodrag rounded-br-md rounded-tr-md border-l-neutral-500'
        value={varType}
      >
        <option value='Select'>Select</option>
        <option value='String'>String</option>
        <option value='Number'>Number</option>
        <option value='Boolean'>Boolean</option>
      </select>
    </div>
  );
};

const EvaluateNode = ({ data }) => {
  if (data.variables == undefined) {
    data.variables = {};
  }

  return (
    <FlowNode
      title='Evaluate'
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source', id: 'true', styles: { bottom: 40, top: 'auto' } }}
    >
      <div className='pb-2'>
        <div>
          <div>{variableElem(data, 'var1')}</div>
          <div>{operatorMenu(data)}</div>
          <div>{variableElem(data, 'var2')}</div>
        </div>
        <div className='text-right'>
          <div className='pb-4'>True</div>
          <div>False</div>
        </div>
      </div>
      <Handle type='source' position={Position.Right} id='false' style={{ bottom: 0, top: 'auto' }} />
    </FlowNode>
  );
};

export default EvaluateNode;
