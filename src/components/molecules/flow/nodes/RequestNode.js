import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import RequestBody from './RequestBody';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getDefaultValue } from 'utils/common';
import AddVariableModal from 'components/molecules/modals/flow/AddVariableModal';
import useCanvasStore from 'stores/CanvasStore';

const RequestNode = ({ id, data }) => {
  const setRequestNodeUrl = useCanvasStore((state) => state.setRequestNodeUrl);
  const requestNodeAddPreRequestVar = useCanvasStore((state) => state.requestNodeAddPreRequestVar);
  const requestNodeDeletePreRequestVar = useCanvasStore((state) => state.requestNodeDeletePreRequestVar);
  const requestNodeChangePreRequestVar = useCanvasStore((state) => state.requestNodeChangePreRequestVar);

  const [variableDialogOpen, setVariableDialogOpen] = useState(false);

  const handleAddVariable = (name, type) => {
    requestNodeAddPreRequestVar(id, name, type);
  };

  const handleDeleteVariable = (event, vId) => {
    requestNodeDeletePreRequestVar(id, vId);
  };

  const handleVariableChange = (event, vId) => {
    requestNodeChangePreRequestVar(id, vId, event.target.value);
  };

  const handleUrlInputChange = (event) => {
    setRequestNodeUrl(id, event.target.value);
  };

  const renderVariables = () => {
    return (
      <>
        {data.preReqVars &&
          Object.keys(data.preReqVars).map((id) => (
            <div className='flex items-center justify-between pb-2' key={id}>
              <div className='flex items-center justify-between text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
                <label className='px-4 py-2 border-r rounded-bl-md rounded-tl-md border-r-neutral-500'>{id}</label>
                {data.preReqVars[id].type === 'Boolean' ? (
                  <select
                    onChange={(e) => handleVariableChange(e, id)}
                    name='boolean-val'
                    className='nodrag h-9 w-full rounded-br-md rounded-tr-md  p-2.5 px-1 '
                    value={data.preReqVars[id].value}
                  >
                    <option value='true'>True</option>
                    <option value='false'>False</option>
                  </select>
                ) : (
                  <input
                    type={getInputType(data.preReqVars[id].type)}
                    className='nodrag nowheel block h-9 w-full rounded-bl-md rounded-tl-md  p-2.5'
                    name='variable-value'
                    data-type={getInputType(data.preReqVars[id].type)}
                    onChange={(e) => handleVariableChange(e, id)}
                    value={data.preReqVars[id].value}
                  />
                )}
                <div className='px-4 py-2 border-l rounded-br-md rounded-tr-md border-l-neutral-500'>
                  {data.preReqVars[id].type}
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
            value={data.url ? data.url : ''}
          />
        </div>
        <RequestBody nodeId={id} nodeData={data} />
        <div className='border-t border-neutral-300 bg-slate-100'>
          <div className='flex items-center justify-between px-2 py-4 font-medium'>
            <h3>Variables</h3>
          </div>
          <div>
            Pre Request
            <button className='p-2' onClick={() => setVariableDialogOpen(true)}>
              <PlusIcon className='w-4 h-4' />
            </button>
            <div className='p-2 pt-4 border-t border-neutral-300 bg-slate-50'>{renderVariables()}</div>
          </div>
          <div>
            Post Response
            <button className='p-2' onClick={() => setVariableDialogOpen(true)}>
              <PlusIcon className='w-4 h-4' />
            </button>
            <div className='p-2 pt-4 border-t border-neutral-300 bg-slate-50'>{renderVariables()}</div>
          </div>
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

RequestNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default RequestNode;
