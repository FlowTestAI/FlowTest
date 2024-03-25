import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Handle, Position } from 'reactflow';
import Operators from '../constants/operators';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ } from 'constants/Common';
import useCanvasStore from 'stores/CanvasStore';

const operatorMenu = (id, data) => {
  const setEvaluateNodeOperator = useCanvasStore((state) => state.setEvaluateNodeOperator);

  const handleOperatorSelection = (event) => {
    const selectedValue = event.target?.value;
    // ToDO: verify the behavior when use selects the default item
    if (selectedValue !== CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value) {
      setEvaluateNodeOperator(id, selectedValue);
    }
  };

  return (
    <div className='mb-4'>
      <select
        onChange={handleOperatorSelection}
        name='operator-type'
        value={data.operator ? data.operator : CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value}
        className='h-12 w-full rounded-md border border-neutral-500 px-1 py-2 text-neutral-500 outline-0 focus:ring-0'
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
const variableElem = (id, data, varName) => {
  const setEvaluateNodeVariable = useCanvasStore((state) => state.setEvaluateNodeVariable);

  const handleInputTypeSelection = (event) => {
    const selectedValue = event.target?.value;
    switch (selectedValue) {
      case 'String':
        setEvaluateNodeVariable(id, varName, selectedValue, '');
        break;
      case 'Select':
        setEvaluateNodeVariable(id, varName, selectedValue, '');
        break;
      case 'Number':
        setEvaluateNodeVariable(id, varName, selectedValue, 0);
        break;
      case 'Boolean':
        setEvaluateNodeVariable(id, varName, selectedValue, false);
        break;
    }
  };

  const handleBooleanValueSelection = (event) => {
    setEvaluateNodeVariable(id, varName, 'Boolean', event.target?.value);
  };

  return (
    <div className='mb-4 flex items-center justify-center rounded-md border border-neutral-500 text-sm text-neutral-500 outline-0 focus:ring-0'>
      {data.variables && data.variables[varName] ? (
        data.variables[varName].type === 'Boolean' ? (
          <select
            onChange={handleBooleanValueSelection}
            name='boolean-val'
            className='nodrag h-12 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
            value={data.variables[varName].value}
          >
            <option value='true'>True</option>
            <option value='false'>False</option>
          </select>
        ) : (
          <input
            id='outlined-adornment-weight'
            type={getInputType(data.variables[varName].type)}
            className='nodrag nowheel block h-12 w-full rounded-bl-md rounded-tl-md  p-2.5'
            name='variable-value'
            placeholder={varName}
            value={data.variables[varName].value}
            onChange={(event) => {
              const updatedValue = event.target.value;
              switch (data.variables[varName].type) {
                case 'String':
                  // data.variables[varName].value = updatedValue.toString();
                  // setVariableValue(updatedValue.toString());
                  setEvaluateNodeVariable(id, varName, 'String', updatedValue.toString());
                  break;
                case 'Select':
                  // data.variables[varName].value = updatedValue.toString();
                  // setVariableValue(updatedValue.toString());
                  setEvaluateNodeVariable(id, varName, 'Select', updatedValue.toString());
                  break;
                case 'Number':
                  // data.variables[varName].value = parseInt(updatedValue);
                  // setVariableValue(parseInt(updatedValue));
                  setEvaluateNodeVariable(id, varName, 'Number', parseInt(updatedValue));
                  break;
              }
            }}
          />
        )
      ) : (
        <input
          id='outlined-adornment-weight'
          type='text'
          className='nodrag nowheel block h-12 w-full rounded-bl-md rounded-tl-md  p-2.5'
          name='variable-value'
          placeholder={varName}
          value=''
          onChange={(event) => {
            // default type is string, as soon as we select another type, it goes to above flow
            const updatedValue = event.target.value;
            setEvaluateNodeVariable(id, varName, 'String', updatedValue.toString());
          }}
        />
      )}

      <select
        onChange={handleInputTypeSelection}
        name='var-input-type'
        className='nodrag h-8 w-full rounded-br-md rounded-tr-md border-l border-l-neutral-500 p-0 px-1'
        value={data.variables && data.variables[varName] ? data.variables[varName].type : 'String'}
      >
        <option value='Select'>Select</option>
        <option value='String'>String</option>
        <option value='Number'>Number</option>
        <option value='Boolean'>Boolean</option>
      </select>
    </div>
  );
};

const EvaluateNode = ({ id, data }) => {
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
          <div>{variableElem(id, data, 'var1')}</div>
          <div>{operatorMenu(id, data)}</div>
          <div>{variableElem(id, data, 'var2')}</div>
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

EvaluateNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default EvaluateNode;
