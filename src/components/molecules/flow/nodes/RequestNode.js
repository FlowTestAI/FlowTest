import React, { useEffect, useState } from 'react';
import RequestBody from './RequestBody';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ModalNames } from 'constants/ModalNames';
import { getDefaultValue } from 'utils/common';
import AddVariableModal from 'components/molecules/modals/flow/AddVariableModal';

function initialVariables(data) {
  if (data.variables != undefined) {
    return data.variables;
  }
  return {};
}

const RequestNode = ({ data }) => {
  const [variableDialogOpen, setVariableDialogOpen] = useState(false);
  const [variables, setVariables] = useState(initialVariables(data));

  const handleAddVariable = (name, type) => {
    const newId = name;
    const newVar = {
      type: type,
      value: getDefaultValue(type),
    };
    setVariables((prevVariables) => {
      return { ...prevVariables, [newId]: newVar };
    });
  };

  const handleDeleteVariable = (event, id) => {
    setVariables((currentVariables) => {
      const { [id]: _, ...newVariables } = currentVariables;
      return newVariables;
    });
  };

  const handleVariableChange = (event, id) => {
    setVariables((currentVariables) => {
      const updateVar = {
        type: currentVariables[id].type,
        value: event.target.value,
      };
      return { ...currentVariables, [id]: updateVar };
    });
  };

  // const handleBooleanChange = (event, id) => {
  //   setVariables((currentVariables) => {
  //     const updateVar = {
  //       type: currentVariables[id].type,
  //       value: event.target.checked,
  //     };
  //     return { ...currentVariables, [id]: updateVar };
  //   });
  // };

  useEffect(() => {
    data.variables = variables;
  }, [variables]);

  const handleUrlInputChange = (event) => {
    data.url = event.target.value;
  };

  const renderVariables = () => {
    return (
      <>
        {Object.keys(variables).map((id) => (
          <div className='flex items-center justify-between pb-2' key={id}>
            <div className='flex items-center justify-between text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
              {variables[id].type === 'Boolean' ? (
                <select
                  onChange={(e) => handleVariableChange(e, id)}
                  name='boolean-val'
                  className='nodrag h-9 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
                  value={variables[id].value}
                >
                  <option value='true'>True</option>
                  <option value='false'>False</option>
                </select>
              ) : (
                <input
                  type={getInputType(variables[id].type)}
                  className='nodrag nowheel block h-9 w-full rounded-bl-md rounded-tl-md  p-2.5'
                  name='variable-value'
                  data-type={getInputType(variables[id].type)}
                  onChange={(e) => handleVariableChange(e, id)}
                  value={variables[id].value}
                />
              )}
              <label>{id}</label>
              <div className='px-4 py-2 border-l rounded-br-md rounded-tr-md border-l-neutral-500'>
                {variables[id].type}
              </div>
            </div>
            <div onClick={(e) => handleDeleteVariable(e, id)} className='p-2 text-neutral-500'>
              <TrashIcon className='w-4 h-4' />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <FlowNode
      title={data.requestType + ' Request'}
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div>
        <div>
          <input
            type='text'
            placeholder={`Enter URL for a ${data.requestType} request`}
            className='nodrag nowheel  mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
            name='username'
            onChange={handleUrlInputChange}
            defaultValue={data.url ? data.url : ''}
          />
        </div>
        <RequestBody nodeData={data} />
        <div className='border-t border-neutral-300 bg-slate-100'>
          <div className='flex items-center justify-between px-2 py-4 font-medium'>
            <h3>Variables</h3>
            <button className='p-2' onClick={() => setVariableDialogOpen(true)}>
              <PlusIcon className='w-4 h-4' />
            </button>
          </div>
          <div className='p-2 pt-4 border-t border-neutral-300 bg-slate-50'>{renderVariables()}</div>
        </div>
      </div>
      <AddVariableModal
        closeFn={() => setVariableDialogOpen(false)}
        open={variableDialogOpen}
        onVariableAdd={handleAddVariable}
      />
    </FlowNode>
  );
};

export default RequestNode;
