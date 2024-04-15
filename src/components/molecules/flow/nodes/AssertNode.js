import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Handle, Position } from 'reactflow';
import AssertOperators from '../constants/assertOperators';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ } from 'constants/Common';
import useCanvasStore from 'stores/CanvasStore';

const operatorMenu = (id, data) => {
  const setAssertNodeOperator = useCanvasStore((state) => state.setAssertNodeOperator);

  const handleOperatorSelection = (event) => {
    const selectedValue = event.target?.value;
    // ToDO: verify the behavior when use selects the default item
    if (selectedValue !== CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value) {
      setAssertNodeOperator(id, selectedValue);
    }
  };

  return (
    <div className='mb-4'>
      <select
        onChange={handleOperatorSelection}
        name='operator-type'
        value={data.operator ? data.operator : CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value}
        className='w-full h-12 px-1 py-2 border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'
      >
        <option value={CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value}>
          {CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.displayValue}
        </option>
        <option value={AssertOperators.isLessThan}>{AssertOperators.isLessThan}</option>
        <option value={AssertOperators.isGreaterThan}>{AssertOperators.isGreaterThan}</option>
        <option value={AssertOperators.isEqualTo}>{AssertOperators.isEqualTo}</option>
        <option value={AssertOperators.isNotEqualTo}>{AssertOperators.isNotEqualTo}</option>
      </select>
    </div>
  );
};

// ToDo: refactor component parameters, make it more readable. vname and data are not suited
const variableElem = (id, data, varName) => {
  const setAssertNodeVariable = useCanvasStore((state) => state.setAssertNodeVariable);

  const handleInputTypeSelection = (event) => {
    const selectedValue = event.target?.value;
    switch (selectedValue) {
      case 'String':
        setAssertNodeVariable(id, varName, selectedValue, '');
        break;
      case 'Select':
        setAssertNodeVariable(id, varName, selectedValue, '');
        break;
      case 'Variable':
        setAssertNodeVariable(id, varName, selectedValue, '');
        break;
      case 'Number':
        setAssertNodeVariable(id, varName, selectedValue, 0);
        break;
      case 'Boolean':
        setAssertNodeVariable(id, varName, selectedValue, false);
        break;
      case 'Now':
        setAssertNodeVariable(id, varName, selectedValue, '');
        break;
    }
  };

  return (
    <div className='flex items-center justify-center mb-4 text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
      {data.variables && data.variables[varName] ? (
        data.variables[varName].type === 'Boolean' ? (
          <select
            onChange={(event) => setAssertNodeVariable(id, varName, 'Boolean', event.target?.value)}
            name='boolean-val'
            className='nodrag h-12 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
            value={data.variables[varName].value}
          >
            <option value='true'>True</option>
            <option value='false'>False</option>
          </select>
        ) : data.variables[varName].type === 'Now' ? (
          <div></div>
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
                  setAssertNodeVariable(id, varName, 'String', updatedValue.toString());
                  break;
                case 'Select':
                  setAssertNodeVariable(id, varName, 'Select', updatedValue.toString());
                  break;
                case 'Variable':
                  setAssertNodeVariable(id, varName, 'Variable', updatedValue.toString());
                  break;
                case 'Number':
                  setAssertNodeVariable(id, varName, 'Number', parseInt(updatedValue));
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
            setAssertNodeVariable(id, varName, 'String', updatedValue.toString());
          }}
        />
      )}

      <select
        onChange={handleInputTypeSelection}
        name='var-input-type'
        className='w-full h-8 p-0 px-1 border-l nodrag rounded-br-md rounded-tr-md border-l-neutral-500'
        value={data.variables && data.variables[varName] ? data.variables[varName].type : 'String'}
      >
        <option value='Select'>Select</option>
        <option value='String'>String</option>
        <option value='Variable'>Variable</option>
        <option value='Number'>Number</option>
        <option value='Boolean'>Boolean</option>
        <option value='Now'>Now</option>
      </select>
    </div>
  );
};

const AssertNode = ({ id, data }) => {
  return (
    <FlowNode
      title='Assert'
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

AssertNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AssertNode;
