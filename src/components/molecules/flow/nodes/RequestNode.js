import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import RequestBody from './RequestBody';
import FlowNode from 'components/atoms/flow/FlowNode';
import { getInputType } from 'utils/common';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getDefaultValue } from 'utils/common';
import AddVariableModal from 'components/molecules/modals/flow/AddVariableModal';
import useCanvasStore from 'stores/CanvasStore';
import TextInput from 'components/atoms/common/TextInput';
import NodeHorizontalDivider from 'components/atoms/flow/NodeHorizontalDivider';

const RequestNode = ({ id, data }) => {
  const setRequestNodeUrl = useCanvasStore((state) => state.setRequestNodeUrl);
  const requestNodeAddPreRequestVar = useCanvasStore((state) => state.requestNodeAddPreRequestVar);
  const requestNodeDeletePreRequestVar = useCanvasStore((state) => state.requestNodeDeletePreRequestVar);
  const requestNodeChangePreRequestVar = useCanvasStore((state) => state.requestNodeChangePreRequestVar);

  const requestNodeAddPostResponseVar = useCanvasStore((state) => state.requestNodeAddPostResponseVar);
  const requestNodeDeletePostResponseVar = useCanvasStore((state) => state.requestNodeDeletePostResponseVar);
  const requestNodeChangePostResponseVar = useCanvasStore((state) => state.requestNodeChangePostResponseVar);

  const [variableDialogOpen, setVariableDialogOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleAddVariable = (vType, name, type) => {
    if (vType === 'pre-request') {
      requestNodeAddPreRequestVar(id, name, type);
    } else if (vType === 'post-response') {
      requestNodeAddPostResponseVar(id, name, type);
    }
  };

  const handleDeleteVariable = (event, vType, vId) => {
    if (vType === 'pre-request') {
      requestNodeDeletePreRequestVar(id, vId);
    } else if (vType === 'post-response') {
      requestNodeDeletePostResponseVar(id, vId);
    }
  };

  const handleVariableChange = (event, vType, vId) => {
    if (vType === 'pre-request') {
      requestNodeChangePreRequestVar(id, vId, event.target.value);
    } else if (vType === 'post-response') {
      requestNodeChangePostResponseVar(id, vId, event.target.value);
    }
  };

  const handleUrlInputChange = (event) => {
    setRequestNodeUrl(id, event.target.value);
  };

  const renderVariables = (vType) => {
    const variables = vType === 'pre-request' ? data.preReqVars : data.postRespVars;
    return (
      <>
        {variables ? (
          <div className='p-2 pt-4 border-t border-neutral-300 bg-slate-50'>
            {Object.keys(variables).map((id) => (
              <div className='flex items-center justify-between pb-2' key={id}>
                <div className='flex items-center justify-between text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
                  <label className='px-4 py-2 border-r rounded-bl-md rounded-tl-md border-r-neutral-500'>{id}</label>
                  {variables[id].type === 'Boolean' ? (
                    <select
                      onChange={(e) => handleVariableChange(e, vType, id)}
                      name='boolean-val'
                      className='nodrag h-9 w-full min-w-40 rounded-br-md  rounded-tr-md p-2.5 px-1'
                      value={variables[id].value}
                    >
                      <option value='true'>True</option>
                      <option value='false'>False</option>
                    </select>
                  ) : variables[id].type === 'Now' ? (
                    <div></div>
                  ) : (
                    <input
                      type={getInputType(variables[id].type)}
                      className='nodrag nowheel block h-9 w-full min-w-40 rounded-bl-md rounded-tl-md p-2.5'
                      name='variable-value'
                      data-type={getInputType(variables[id].type)}
                      onChange={(e) => handleVariableChange(e, vType, id)}
                      value={variables[id].value}
                    />
                  )}
                  <div className='px-4 py-2 border-l rounded-br-md rounded-tr-md border-l-neutral-500'>
                    {variables[id].type}
                  </div>
                </div>
                <div onClick={(e) => handleDeleteVariable(e, vType, id)} className='pl-2 text-neutral-500'>
                  <TrashIcon className='w-4 h-4' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
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
      <div className='min-w-80'>
        <div className='pb-4'>
          <TextInput
            placeHolder={`Enter URL for a ${data.requestType} request`}
            onChangeHandler={handleUrlInputChange}
            name={'username'}
            value={data.url ? data.url : ''}
          />
        </div>
        <NodeHorizontalDivider />
        <RequestBody nodeId={id} nodeData={data} />
        <NodeHorizontalDivider />
        <div className='p-4 bg-background'>
          <h3>Variables</h3>
          <div className='mt-4'>
            <NodeHorizontalDivider />
            <div className='p-2'>
              <div className='flex items-center justify-between'>
                <div>Pre Request</div>
                <button
                  onClick={() => {
                    setModalType('pre-request');
                    setVariableDialogOpen(true);
                  }}
                >
                  <PlusIcon className='w-4 h-4' />
                </button>
              </div>
              {renderVariables('pre-request')}
            </div>
            <NodeHorizontalDivider />
            <div className='p-2'>
              <div className='flex items-center justify-between'>
                <div>Post Response</div>
                <button
                  onClick={() => {
                    setModalType('post-response');
                    setVariableDialogOpen(true);
                  }}
                >
                  <PlusIcon className='w-4 h-4' />
                </button>
              </div>
              {renderVariables('post-response')}
            </div>
          </div>
        </div>
        <NodeHorizontalDivider />
      </div>
      <AddVariableModal
        closeFn={() => setVariableDialogOpen(false)}
        open={variableDialogOpen}
        modalType={modalType}
        onVariableAdd={handleAddVariable}
      />
    </FlowNode>
  );
};

RequestNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default RequestNode;
