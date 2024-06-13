import React, { useEffect, useState, Fragment } from 'react';
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
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import requestNodes from '../constants/requestNodes';
import { TextEditor } from 'components/atoms/common/TextEditor';
import useCollectionStore from 'stores/CollectionStore';
import { useTabStore } from 'stores/TabStore';
import { cloneDeep } from 'lodash';

const RequestNode = ({ id, data }) => {
  const setRequestNodeUrl = useCanvasStore((state) => state.setRequestNodeUrl);
  const setRequestNodeType = useCanvasStore((state) => state.setRequestNodeType);
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

  const handleUrlInputChange = (value) => {
    setRequestNodeUrl(id, value);
  };

  const renderNewVars = (vType) => {
    const variables = vType === 'pre-request' ? data.preReqVars : data.postRespVars;
    return (
      <>
        {variables && Object.keys(variables).length > 0 ? (
          <table className='leading-normal'>
            <thead>
              <tr className='text-xs font-bold tracking-wider text-left bg-ghost-50 text-ghost-600'>
                <th className='p-1 border border-ghost-200'>Name</th>
                <th className='p-1 border border-ghost-200 '>Value</th>
                <th className='p-1 border border-ghost-200 '></th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(variables).map((id, index) => (
                <tr key={index} className='text-sm border-b border-gray-200 text-ghost-700 hover:bg-ghost-50'>
                  <td className='p-1 whitespace-no-wrap'>
                    <input
                      type='text'
                      className='nodrag nowheel block h-9 rounded-bl-md rounded-tl-md p-2.5'
                      name='variable-name'
                      value={id}
                      readOnly
                    />
                  </td>
                  <td className='p-1 whitespace-no-wrap'>
                    {variables[id].type === 'Boolean' ? (
                      <select
                        onChange={(e) => handleVariableChange(e, vType, id)}
                        name='boolean-val'
                        className='nodrag h-9 rounded-br-md  rounded-tr-md p-2.5 px-1'
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
                        className='nodrag nowheel block h-9 rounded-bl-md rounded-tl-md p-2.5'
                        name='variable-value'
                        data-type={getInputType(variables[id].type)}
                        onChange={(e) => handleVariableChange(e, vType, id)}
                        value={variables[id].value}
                      />
                    )}
                  </td>
                  <td className='p-1 whitespace-no-wrap'>
                    <div onClick={(e) => handleDeleteVariable(e, vType, id)} className='pl-2 text-neutral-500'>
                      <TrashIcon className='w-4 h-4' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          ''
        )}
      </>
    );
  };

  const renderVariables = (vType) => {
    const variables = vType === 'pre-request' ? data.preReqVars : data.postRespVars;
    return (
      <>
        {variables && Object.keys(variables).length > 0 ? (
          <div className='p-2 pt-4 border-t border-neutral-300 bg-slate-50'>
            {Object.keys(variables).map((id) => (
              <div className='flex items-center justify-between pb-2' key={id}>
                <div className='flex items-center justify-between text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
                  <label className='w-1/4 px-4 py-2 border-r rounded-bl-md rounded-tl-md border-r-neutral-500'>
                    {id}
                  </label>
                  {variables[id].type === 'Boolean' ? (
                    <select
                      onChange={(e) => handleVariableChange(e, vType, id)}
                      name='boolean-val'
                      className='nodrag h-9 w-2/4 min-w-40 rounded-br-md  rounded-tr-md p-2.5 px-1'
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
                      className='nodrag nowheel block h-9 w-2/4 min-w-40 rounded-bl-md rounded-tl-md p-2.5'
                      name='variable-value'
                      data-type={getInputType(variables[id].type)}
                      onChange={(e) => handleVariableChange(e, vType, id)}
                      value={variables[id].value}
                    />
                  )}
                  <div className='w-1/4 px-4 py-2 border-l rounded-br-md rounded-tr-md border-l-neutral-500'>
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

  const getActiveVariables = () => {
    const collectionId = useCanvasStore.getState().collectionId;
    if (collectionId) {
      const activeEnv = useCollectionStore
        .getState()
        .collections.find((c) => c.id === collectionId)
        ?.environments.find((e) => e.name === useTabStore.getState().selectedEnv);
      if (activeEnv) {
        return Object.keys(cloneDeep(activeEnv.variables));
      }
    }
    return [];
  };

  const listBox = () => {
    return (
      <Listbox
        value={data.requestType}
        onChange={(selectedValue) => {
          setRequestNodeType(id, selectedValue);
        }}
        className='text-xl'
      >
        <div>
          <Listbox.Button className='relative flex text-left cursor-default border-cyan-950'>
            <span className='block truncate'>{data.requestType}</span>
            <span className='p-1'>
              <ChevronUpDownIcon className='w-5 h-5' aria-hidden='true' />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute z-50 py-1 mt-1 overflow-auto text-base bg-white max-h-60 w-36 focus:outline-none'>
              {requestNodes
                .map((el) => el.requestType)
                .map((reqType) => (
                  <Listbox.Option
                    key={reqType}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-7 pr-4 hover:font-semibold ${
                        active ? 'bg-background-light text-slate-900' : ''
                      }`
                    }
                    value={reqType}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block`}>{reqType}</span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-1 font-semibold'>
                            <CheckIcon className='w-5 h-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    );
  };

  return (
    <FlowNode
      title={listBox()}
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div className='w-96'>
        <TextEditor
          placeHolder={`Enter URL for a ${data.requestType} request`}
          onChangeHandler={handleUrlInputChange}
          name={'url'}
          value={data.url ? data.url : ''}
          completionOptions={getActiveVariables()}
          styles={'w-full mb-2'}
        />
        <NodeHorizontalDivider />
        <RequestBody nodeId={id} nodeData={data} />
        <NodeHorizontalDivider />
        <div className='bg-background'>
          <h3 className='p-2'>Variables</h3>
          <div>
            <NodeHorizontalDivider />
            <div>
              <div className='flex items-center justify-between'>
                <div className='p-2'>Pre Request</div>
                <button
                  onClick={() => {
                    setModalType('pre-request');
                    setVariableDialogOpen(true);
                  }}
                >
                  <PlusIcon className='w-4 h-4' />
                </button>
              </div>
              {renderNewVars('pre-request')}
            </div>
            <NodeHorizontalDivider />
            <div>
              <div className='flex items-center justify-between'>
                <div className='p-2'>Post Response</div>
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
