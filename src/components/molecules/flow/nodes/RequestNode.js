import React from 'react';
import RequestBody from './RequestBody';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ModalNames } from 'constants/ModalNames';
import { useRequestNodeStore } from 'stores/flow/RequestNodeStore';
import { useRenderCount } from 'utils/useRenderCount';

const RequestNode = ({ data }) => {
  const renderCount = useRenderCount();
  const variablesData = useRequestNodeStore((state) => state.variablesData);
  const deleteFromVariablesData = useRequestNodeStore((state) => state.deleteFromVariablesData);
  const updateVariableValue = useRequestNodeStore((state) => state.updateVariableValue);

  const handleVariableChange = (event, variableName) => {
    console.log(`\n \n handleVariableChange :: ${event.target.dataset.type} \n \n`);
    const type = event.target.dataset.type;
    const updateVar = {
      type: type,
      value: event.target.value,
    };
    updateVariableValue(variableName, updateVar);
  };

  const handleUrlInputChange = (event) => {
    data.url = event.target.value;
  };

  const renderVariablesData = () => {
    return variablesData.map((variableData, index) => {
      const variableName = Object.keys(variableData)[0];
      const variableValue = variableData[variableName];
      return (
        <div className='tw-flex tw-items-center tw-justify-between tw-pb-2' key={index}>
          <div className='tw-flex tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-neutral-500 tw-text-sm tw-text-neutral-500 tw-outline-0 focus:tw-ring-0'>
            {variableValue.type === 'Boolean' ? (
              <select
                onChange={(e) => handleVariableChange(e, variableName)}
                name='boolean-val'
                className='nodrag tw-h-9 tw-w-full tw-rounded-br-md tw-rounded-tr-md  tw-p-2.5 tw-px-1 '
                default={variableValue.value}
                data-type={getInputType(variableValue.type)}
              >
                <option value='true'>True</option>
                <option value='false'>False</option>
              </select>
            ) : (
              <input
                type={getInputType(variableValue.type)}
                className='nodrag nowheel tw-block tw-h-9 tw-w-full tw-rounded-bl-md tw-rounded-tl-md  tw-p-2.5'
                name='variable-value'
                placeholder={variableName}
                data-type={getInputType(variableValue.type)}
                onChange={(e) => handleVariableChange(e, variableName)}
              />
            )}
            <div className='tw-rounded-br-md tw-rounded-tr-md tw-border-l tw-border-l-neutral-500 tw-px-4 tw-py-2'>
              {variableValue.type}
            </div>
          </div>
          <div onClick={() => deleteFromVariablesData(variableName)} className='tw-p-2 tw-text-neutral-500'>
            <TrashIcon className='tw-h-4 tw-w-4' />
          </div>
        </div>
      );
    });
  };

  return (
    <FlowNode
      title={data.requestType + ' Request'}
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      {console.log(`\n \n INSIDE :: renderVariablesData :: ${renderCount}`)}
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
            <button className='tw-p-2' data-modal={ModalNames.ADD_VARIABLE_FOR_REQUEST_NODE_MODAL}>
              <PlusIcon className='tw-h-4 tw-w-4' data-modal={ModalNames.ADD_VARIABLE_FOR_REQUEST_NODE_MODAL} />
            </button>
          </div>
          {variablesData.length > 0 ? (
            <div className='tw-border-t tw-border-neutral-300 tw-bg-slate-50 tw-p-2 tw-pt-4'>
              {renderVariablesData()}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </FlowNode>
  );
};

export default RequestNode;
