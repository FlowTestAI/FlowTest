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
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Tab } from '@headlessui/react';

const RequestNode = ({ id, data }) => {
  const setRequestNodeUrl = useCanvasStore((state) => state.setRequestNodeUrl);
  const setRequestNodeType = useCanvasStore((state) => state.setRequestNodeType);
  const setRequestNodeHeaders = useCanvasStore((state) => state.setRequestNodeHeaders);
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

  const Tooltip = ({ text }) => {
    return (
      <Tippy content={text} placement='top' maxWidth='none'>
        <svg
          tabIndex='-1'
          id='tooltipId'
          xmlns='http://www.w3.org/2000/svg'
          width='14'
          height='14'
          fill='currentColor'
          className='ml-2 inline-block cursor-pointer'
          viewBox='0 0 16 16'
          style={{ marginTop: 1 }}
        >
          <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
          <path d='M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z' />
        </svg>
      </Tippy>
    );
  };

  const renderVariables = (vType) => {
    const variables = vType === 'pre-request' ? data.preReqVars : data.postRespVars;
    return (
      <div>
        {variables && Object.keys(variables).length > 0 ? (
          <table className='border-collapse border-2 border-background-dark leading-normal'>
            <thead>
              <tr className='bg-ghost-50 text-ghost-600 text-left text-xs font-bold tracking-wider'>
                <th className='border-2 border-background-dark p-2'>Name</th>
                <th className='border-2 border-background-dark p-2'>Value</th>
                <th className='border-2 border-background-dark p-2'></th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(variables).map((id, index) => (
                <tr key={index} className='text-ghost-700 hover:bg-ghost-50 border-b border-gray-200 text-sm'>
                  <td className='whitespace-no-wrap border-2 border-background-dark'>
                    <input
                      type='text'
                      className='nodrag nowheel block h-9 w-full bg-transparent p-2.5 outline-none'
                      name='variable-name'
                      value={id}
                      readOnly
                    />
                  </td>
                  <td className='whitespace-no-wrap border-2 border-background-dark'>
                    {variables[id].type === 'Boolean' ? (
                      <select
                        onChange={(e) => handleVariableChange(e, vType, id)}
                        name='boolean-val'
                        className=' nodrag nowheel h-9 w-full bg-background-light p-2.5 px-1 outline-none'
                        value={variables[id].value}
                      >
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                      </select>
                    ) : variables[id].type === 'Now' ? (
                      <input
                        type='text'
                        className='nodrag nowheel block h-9 w-full bg-background-light p-2.5 outline-none'
                        name='variable-name'
                        value='Date.now()'
                        readOnly
                      />
                    ) : (
                      <input
                        type={getInputType(variables[id].type)}
                        className='nodrag nowheel block h-9 w-full bg-background-light p-2.5 outline-none'
                        name='variable-value'
                        data-type={getInputType(variables[id].type)}
                        onChange={(e) => handleVariableChange(e, vType, id)}
                        value={variables[id].value}
                      />
                    )}
                  </td>
                  <td className='border-2 border-background-dark p-2'>
                    <div className='flex items-center gap-4'>
                      <Tooltip text={variables[id].type} />
                      <div onClick={(e) => handleDeleteVariable(e, vType, id)} className='cursor-pointer'>
                        <TrashIcon className='h-4 w-4' />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          ''
        )}
      </div>
    );
  };

  const renderHeaders = () => {
    return (
      <div>
        {data.headers && data.headers.length > 0 ? (
          <table className='border-collapse border-2 border-background-dark leading-normal'>
            <thead>
              <tr className='bg-ghost-50 text-ghost-600 text-left text-xs font-bold tracking-wider'>
                <th className='border-2 border-background-dark p-2'>Name</th>
                <th className='border-2 border-background-dark p-2'>Value</th>
                <th className='border-2 border-background-dark p-2'></th>
              </tr>
            </thead>
            <tbody>
              {data.headers.map((pair, index) => (
                <tr key={index} className='text-ghost-700 hover:bg-ghost-50 border-b border-gray-200 text-sm'>
                  <td className='whitespace-no-wrap border-2 border-background-dark'>
                    <input
                      type='text'
                      className='nodrag nowheel block h-9 w-full bg-background-light p-2.5 outline-none'
                      name='header-name'
                      value={pair.name}
                      onChange={(e) => {
                        const existingHeaders = [...data.headers];
                        existingHeaders[index].name = e.target.value;
                        setRequestNodeHeaders(id, existingHeaders);
                      }}
                    />
                  </td>
                  <td className='whitespace-no-wrap border-2 border-background-dark'>
                    <input
                      type='text'
                      className='nodrag nowheel block h-9 w-full bg-background-light p-2.5 outline-none'
                      name='header-value'
                      data-type='text'
                      onChange={(e) => {
                        const existingHeaders = [...data.headers];
                        existingHeaders[index].value = e.target.value;
                        setRequestNodeHeaders(id, existingHeaders);
                      }}
                      value={pair.value}
                    />
                  </td>
                  <td className='border-2 border-background-dark p-2'>
                    <div className='flex items-center gap-4'>
                      {/* <Tooltip text={variables[id].type} /> */}
                      <div
                        onClick={(e) => {
                          setRequestNodeHeaders(
                            id,
                            data.headers.filter((_, i) => i !== index),
                          );
                        }}
                        className='cursor-pointer'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          ''
        )}
      </div>
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
          <Listbox.Button className='relative flex cursor-default border-cyan-950 text-left'>
            <span className='block truncate'>{data.requestType}</span>
            <span className='p-1'>
              <ChevronUpDownIcon className='h-5 w-5' aria-hidden='true' />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-36 overflow-auto bg-white py-1 text-base focus:outline-none'>
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
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
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

  const getDefaultIndex = () => {
    if (data.requestBody?.type) {
      return 0;
    } else if (
      (data.preReqVars && Object.entries(data.preReqVars).length > 0) ||
      (data.postRespVars && Object.entries(data.postRespVars).length > 0)
    ) {
      return 1;
    } else if (data.headers && data.headers.length > 0) {
      return 2;
    } else {
      return 0;
    }
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
        <Tab.Group defaultIndex={getDefaultIndex()}>
          <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1'>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              Body
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              Variables
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              Headers
            </Tab>
          </Tab.List>
          <Tab.Panels className='mt-2'>
            <Tab.Panel>
              <RequestBody nodeId={id} nodeData={data} />
            </Tab.Panel>
            <Tab.Panel>
              <div className='bg-background'>
                <h3 className='p-2'>Variables</h3>
                <div className='px-2'>
                  <NodeHorizontalDivider />
                  <div className='pb-2'>
                    <div className='flex items-center justify-between'>
                      <div className='p-2'>Pre Request</div>
                      <button
                        onClick={() => {
                          setModalType('pre-request');
                          setVariableDialogOpen(true);
                        }}
                      >
                        <PlusIcon className='h-4 w-4' />
                      </button>
                    </div>
                    {renderVariables('pre-request')}
                  </div>
                  <NodeHorizontalDivider />
                  <div className='pb-2'>
                    <div className='flex items-center justify-between'>
                      <div className='p-2'>Post Response</div>
                      <button
                        onClick={() => {
                          setModalType('post-response');
                          setVariableDialogOpen(true);
                        }}
                      >
                        <PlusIcon className='h-4 w-4' />
                      </button>
                    </div>
                    {renderVariables('post-response')}
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className='bg-background'>
                {/* <h3 className='p-2'>Headers</h3> */}
                <div className='px-2'>
                  <NodeHorizontalDivider />
                  <div className='pb-2'>
                    <div className='flex items-center justify-between'>
                      <div className='p-2'>Headers</div>
                      <button
                        onClick={() => {
                          const existingHeaders = data.headers || [];
                          const updatedHeaders = existingHeaders.concat([{ name: '', value: '' }]);
                          setRequestNodeHeaders(id, updatedHeaders);
                        }}
                      >
                        <PlusIcon className='h-4 w-4' />
                      </button>
                    </div>
                    {renderHeaders()}
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
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
