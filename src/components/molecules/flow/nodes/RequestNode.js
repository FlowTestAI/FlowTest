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
          <div className='tw-flex tw-items-center tw-justify-between tw-pb-2' key={id}>
            <div className='tw-flex tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-neutral-500 tw-text-sm tw-text-neutral-500 tw-outline-0 focus:tw-ring-0'>
              {variables[id].type === 'Boolean' ? (
                <select
                  onChange={(e) => handleVariableChange(e, id)}
                  name='boolean-val'
                  className='nodrag tw-h-9 tw-w-full tw-rounded-br-md tw-rounded-tr-md  tw-p-2.5 tw-px-1 '
                  value={variables[id].value}
                >
                  <option value='true'>True</option>
                  <option value='false'>False</option>
                </select>
              ) : (
                <input
                  type={getInputType(variables[id].type)}
                  className='nodrag nowheel tw-block tw-h-9 tw-w-full tw-rounded-bl-md tw-rounded-tl-md  tw-p-2.5'
                  name='variable-value'
                  data-type={getInputType(variables[id].type)}
                  onChange={(e) => handleVariableChange(e, id)}
                  value={variables[id].value}
                />
              )}
              <label>{id}</label>
              <div className='tw-rounded-br-md tw-rounded-tr-md tw-border-l tw-border-l-neutral-500 tw-px-4 tw-py-2'>
                {variables[id].type}
              </div>
            </div>
            <div onClick={(e) => handleDeleteVariable(e, id)} className='tw-p-2 tw-text-neutral-500'>
              <TrashIcon className='tw-h-4 tw-w-4' />
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
      {/*console.log(`\n \n INSIDE :: renderVariablesData :: ${renderCount}`)*/}
      <div>
        <div>
          <input
            type='text'
            placeholder={`Enter URL for a ${data.requestType} request`}
            className='nodrag nowheel  tw-mb-2 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-2.5 tw-text-sm tw-text-gray-900 tw-outline-blue-300 focus:tw-border-blue-100 focus:tw-ring-blue-100'
            name='username'
            onChange={handleUrlInputChange}
            defaultValue={data.url ? data.url : ''}
          />
        </div>
        <RequestBody nodeData={data} />
        <div className='tw-border-t tw-border-neutral-300 tw-bg-slate-100'>
          <div className='tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-4 tw-font-medium'>
            <h3>Variables</h3>
            <button className='tw-p-2' onClick={() => setVariableDialogOpen(true)}>
              <PlusIcon className='tw-h-4 tw-w-4' />
            </button>
          </div>
          {/* {variables.length > 0 ? ( */}
          <div className='tw-border-t tw-border-neutral-300 tw-bg-slate-50 tw-p-2 tw-pt-4'>{renderVariables()}</div>
          {/* // ) : (
          //   ''
          // )} */}
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
