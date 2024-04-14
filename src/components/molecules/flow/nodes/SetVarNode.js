import React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { variableTypes } from 'components/molecules/modals/flow/AddVariableModal';
import useCanvasStore from 'stores/CanvasStore';
import { CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ } from 'constants/Common';
import EvaluateOperators from '../constants/evaluateOperators';

const SetVarNode = ({ id, data }) => {
  const setVariableNodeName = useCanvasStore((state) => state.setVariableNodeName);
  const setVariableNodeType = useCanvasStore((state) => state.setVariableNodeType);

  const variableNodeChangeVar = useCanvasStore((state) => state.variableNodeChangeVar);
  const setVariableNodeExpressionsVariable = useCanvasStore((state) => state.setVariableNodeExpressionsVariable);
  const setVariableNodeExpressionOperator = useCanvasStore((state) => state.setVariableNodeExpressionOperator);

  const renderVariable = () => {
    return (
      <div className='flex items-center justify-between pb-2'>
        <div className='flex items-center justify-between text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
          {data.variable.type === 'Boolean' ? (
            <select
              onChange={(e) => variableNodeChangeVar(id, e.target.value)}
              name='boolean-val'
              className='nodrag h-9 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
              value={data.variable.value}
            >
              <option value='true'>True</option>
              <option value='false'>False</option>
            </select>
          ) : data.variable.type === 'Now' ? (
            <div></div>
          ) : (
            <input
              type={getInputType(data.variable.type)}
              className='nodrag nowheel block h-9 w-full rounded-bl-md rounded-tl-md  p-2.5'
              name='variable-value'
              data-type={getInputType(data.variable.type)}
              onChange={(e) => variableNodeChangeVar(id, e.target.value)}
              value={data.variable.value}
            />
          )}
        </div>
      </div>
    );
  };

  const operatorMenu = (id, data) => {
    const handleOperatorSelection = (event) => {
      const selectedValue = event.target?.value;
      // ToDO: verify the behavior when use selects the default item
      if (selectedValue !== CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value) {
        setVariableNodeExpressionOperator(id, selectedValue);
      }
    };

    return (
      <div className='mb-4'>
        <select
          onChange={handleOperatorSelection}
          name='operator-type'
          value={
            data.variable && data.variable.value.operator
              ? data.variable.value.operator
              : CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value
          }
          className='w-full h-12 px-1 py-2 border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'
        >
          <option value={CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.value}>
            {CHOOSE_OPERATOR_DEFAULT_VALUE_OBJ.displayValue}
          </option>
          {Object.entries(EvaluateOperators).map(([key, value], index) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const variableElem = (id, data, varName) => {
    const handleInputTypeSelection = (event) => {
      const selectedValue = event.target?.value;
      switch (selectedValue) {
        case 'String':
          setVariableNodeExpressionsVariable(id, varName, selectedValue, '');
          break;
        case 'Select':
          setVariableNodeExpressionsVariable(id, varName, selectedValue, '');
          break;
        case 'Variable':
          setVariableNodeExpressionsVariable(id, varName, selectedValue, '');
          break;
        case 'Number':
          setVariableNodeExpressionsVariable(id, varName, selectedValue, 0);
          break;
        case 'Boolean':
          setVariableNodeExpressionsVariable(id, varName, selectedValue, false);
          break;
      }
    };

    return (
      <div className='flex items-center justify-center mb-4 text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
        {data.variable && data.variable.value.variables && data.variable.value.variables[varName] ? (
          data.variable.value.variables[varName].type === 'Boolean' ? (
            <select
              onChange={(event) => setVariableNodeExpressionsVariable(id, varName, 'Boolean', event.target?.value)}
              name='boolean-val'
              className='nodrag h-12 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
              value={data.variable.value.variables[varName].value}
            >
              <option value='true'>True</option>
              <option value='false'>False</option>
            </select>
          ) : (
            <input
              id='outlined-adornment-weight'
              type={getInputType(data.variable.value.variables[varName].type)}
              className='nodrag nowheel block h-12 w-full rounded-bl-md rounded-tl-md  p-2.5'
              name='variable-value'
              placeholder={varName}
              value={data.variable.value.variables[varName].value}
              onChange={(event) => {
                const updatedValue = event.target.value;
                switch (data.variable.value.variables[varName].type) {
                  case 'String':
                    // data.variables[varName].value = updatedValue.toString();
                    // setVariableValue(updatedValue.toString());
                    setVariableNodeExpressionsVariable(id, varName, 'String', updatedValue.toString());
                    break;
                  case 'Select':
                    // data.variables[varName].value = updatedValue.toString();
                    // setVariableValue(updatedValue.toString());
                    setVariableNodeExpressionsVariable(id, varName, 'Select', updatedValue.toString());
                    break;
                  case 'Variable':
                    // data.variables[varName].value = updatedValue.toString();
                    // setVariableValue(updatedValue.toString());
                    setVariableNodeExpressionsVariable(id, varName, 'Variable', updatedValue.toString());
                    break;
                  case 'Number':
                    // data.variables[varName].value = parseInt(updatedValue);
                    // setVariableValue(parseInt(updatedValue));
                    setVariableNodeExpressionsVariable(id, varName, 'Number', parseInt(updatedValue));
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
              setVariableNodeExpressionsVariable(id, varName, 'String', updatedValue.toString());
            }}
          />
        )}

        <select
          onChange={handleInputTypeSelection}
          name='var-input-type'
          className='w-full h-8 p-0 px-1 border-l nodrag rounded-br-md rounded-tr-md border-l-neutral-500'
          value={
            data.variable && data.variable.value.variables && data.variable.value.variables[varName]
              ? data.variable.value.variables[varName].type
              : 'String'
          }
        >
          <option value='Select'>Select</option>
          <option value='String'>String</option>
          <option value='Variable'>Variable</option>
          <option value='Number'>Number</option>
          <option value='Boolean'>Boolean</option>
        </select>
      </div>
    );
  };

  return (
    <FlowNode
      title={'Set Variable'}
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div>
        <div>
          <input
            type='text'
            placeholder={`Enter variable name`}
            className='nodrag nowheel  mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
            name='variable_name'
            onChange={(e) => setVariableNodeName(id, e.target.value)}
            value={data.variable && data.variable.name ? data.variable.name : ''}
          />
          <select
            onChange={(e) => setVariableNodeType(id, e.target.value)}
            name='var-input-type'
            className='w-full h-8 p-0 px-1 border-l nodrag rounded-br-md rounded-tr-md border-l-neutral-500'
            value={data.variable && data.variable.type ? data.variable.type : ''}
          >
            <option value=''>None</option>
            {variableTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value='Expression'>Expression</option>
          </select>
        </div>
        {data.variable && data.variable.type ? (
          data.variable.type === 'Expression' ? (
            <div>
              <div>{variableElem(id, data, 'var1')}</div>
              <div>{operatorMenu(id, data)}</div>
              <div>{variableElem(id, data, 'var2')}</div>
            </div>
          ) : data.variable.type === '' ? (
            <div></div>
          ) : (
            <div>
              <div>{renderVariable()}</div>
            </div>
          )
        ) : (
          <div></div>
        )}
      </div>
    </FlowNode>
  );
};

SetVarNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SetVarNode;
