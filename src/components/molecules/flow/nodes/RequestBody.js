import React, { Fragment, useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/24/solid';
import {
  DocumentArrowUpIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
//import { Menu, Transition } from '@headlessui/react';
import useCanvasStore from 'stores/CanvasStore';
import { toast } from 'react-toastify';
import { Editor } from 'components/atoms/Editor';
import NodeHorizontalDivider from 'components/atoms/flow/NodeHorizontalDivider';
import TextInputWithLabel from 'components/atoms/common/TextInputWithLabel';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import useCollectionStore from 'stores/CollectionStore';
import { useTabStore } from 'stores/TabStore';
import { cloneDeep } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Tippy from '@tippyjs/react';
import FormDataSelector from './FormDataSelector';

const requestBodyTypeOptions = ['None', 'form-data', 'raw-json'];

const RequestBody = ({ nodeId, nodeData }) => {
  const { ipcRenderer } = window;
  const setRequestNodeBody = useCanvasStore((state) => state.setRequestNodeBody);
  const [cachedValues, setCachedValues] = React.useState({});

  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

  // Refs to hold the input elements
  const inputRefs = useRef([]);

  const updateCachedValues = () => {
    if (nodeData.requestBody) {
      if (nodeData.requestBody.type) {
        setCachedValues({
          ...cachedValues,
          [nodeData.requestBody.type]: nodeData.requestBody.body,
        });
      }
    }
  };

  const handleFileUpload = async (e, index) => {
    if (!e.target.files) return;

    if (e.target.files.length === 1) {
      const file = e.target.files[0];
      const { name, path } = file;

      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;

        const value = result;

        const updatedParams = [...nodeData.requestBody.body];
        const activeCollectionId = useCanvasStore.getState().collectionId;
        const activeCollection = useCollectionStore.getState().collections.find((c) => c.id === activeCollectionId);
        if (activeCollection && path.startsWith(activeCollection.pathname)) {
          updatedParams[index].value = ipcRenderer.relative(activeCollection.pathname, path);
        } else {
          updatedParams[index].value = path;
        }

        updatedParams[index].name = name;
        setRequestNodeBody(nodeId, 'form-data', updatedParams);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRawJson = (value) => {
    setRequestNodeBody(nodeId, 'raw-json', value);
  };

  const handleClose = (option) => {
    updateCachedValues();
    if (option == 'None') {
      setRequestNodeBody(nodeId, option, undefined);
    } else if (option == 'raw-json') {
      if (cachedValues['raw-json']) {
        setRequestNodeBody(nodeId, option, cachedValues['raw-json']);
      } else {
        setRequestNodeBody(nodeId, option, '');
      }
    } else if (option == 'form-data') {
      if (cachedValues['form-data']) {
        setRequestNodeBody(nodeId, option, cachedValues['form-data']);
      } else {
        setRequestNodeBody(nodeId, option, []);
      }
    }
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

  const renderFormData = (params) => {
    return (
      <div>
        {params && params.length > 0 ? (
          <table className='border-collapse border-2 border-background-dark leading-normal'>
            <thead>
              <tr className='bg-ghost-50 text-ghost-600 text-left text-xs font-bold tracking-wider'>
                <th className='border-2 border-background-dark p-2'>Key</th>
                <th className='border-2 border-background-dark p-2'>Value</th>
                <th className='border-2 border-background-dark p-2'></th>
              </tr>
            </thead>
            <tbody>
              {params.map((param, index) => (
                <tr key={index} className='text-ghost-700 hover:bg-ghost-50 border-b border-gray-200 text-sm'>
                  <td className='whitespace-no-wrap border-2 border-background-dark'>
                    <input
                      type='text'
                      className='nodrag nowheel block h-9 w-full bg-background-light p-2.5 outline-none'
                      name='variable-name'
                      value={param.key}
                      onChange={(event) => {
                        const updatedParams = [...nodeData.requestBody.body];
                        updatedParams[index].key = event.target.value;
                        setRequestNodeBody(nodeId, 'form-data', updatedParams);
                      }}
                    />
                  </td>
                  <td className='whitespace-no-wrap border-2 border-background-dark'>
                    {param.type === 'text' ? (
                      <input
                        type='text'
                        className='nodrag nowheel block h-9 w-full bg-background-light p-2.5 outline-none'
                        name='variable-name'
                        value={param.value}
                        onChange={(event) => {
                          const updatedParams = [...nodeData.requestBody.body];
                          updatedParams[index].value = event.target.value;
                          setRequestNodeBody(nodeId, 'form-data', updatedParams);
                        }}
                      />
                    ) : (
                      <div className='nodrag nowheel w-full'>
                        <Button
                          btnType={BUTTON_TYPES.secondary}
                          isDisabled={false}
                          onClickHandle={() => {
                            //uploadFileForRequestNode.current.click();
                            if (inputRefs.current[index]) {
                              inputRefs.current[index].click(); // Trigger the file input click
                            }
                          }}
                          fullWidth={true}
                        >
                          <DocumentArrowUpIcon className='h-4 w-4 text-center' />
                          <div
                            className='max-w-xs overflow-hidden whitespace-nowrap'
                            style={{ textOverflow: 'ellipsis' }}
                          >
                            {param.name && param.name.trim() !== '' ? param.name : 'Upload File'}
                          </div>
                          {/* Ref: https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div */}
                          <div className='hidden'>
                            <input
                              type='file'
                              id='file'
                              ref={(el) => (inputRefs.current[index] = el)}
                              onChange={(e) => handleFileUpload(e, index)}
                            />
                          </div>
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className='border-2 border-background-dark p-2'>
                    <div className='flex items-center gap-4'>
                      <div
                        onClick={() => {
                          const updatedParams = nodeData.requestBody.body.filter((_, i) => i !== index);
                          setRequestNodeBody(nodeId, 'form-data', updatedParams);
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

  return (
    <>
      <div className='flex items-center justify-between bg-background p-4'>
        <h3>Body</h3>
        <Listbox
          value={nodeData.requestBody?.type ? nodeData.requestBody.type : 'None'}
          onChange={(selectedValue) => {
            handleClose(selectedValue);
          }}
          className='text-xl'
        >
          <div>
            <Listbox.Button className='relative flex cursor-default border-cyan-950 text-left'>
              <EllipsisVerticalIcon className='h-4 w-4' aria-hidden='true' data-click-from='body-type-menu' />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-36 overflow-auto bg-white py-1 text-base focus:outline-none'>
                {requestBodyTypeOptions.map((bodyTypeOption) => (
                  <Listbox.Option
                    key={bodyTypeOption}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-7 pr-4 hover:font-semibold ${
                        active ? 'bg-background-light text-slate-900' : ''
                      }`
                    }
                    value={bodyTypeOption}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block`}>{bodyTypeOption}</span>
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
      </div>
      {nodeData.requestBody && nodeData.requestBody.type === 'raw-json' && (
        <>
          <NodeHorizontalDivider />
          <div className='bg-background p-4'>
            <div className='nodrag nowheel w-full min-w-72'>
              <div className='relative bg-background-lighter'>
                <Editor
                  name='request-body-json'
                  onChange={(e) => handleRawJson(e)}
                  value={nodeData.requestBody.body}
                  classes={'w-full max-h-96'}
                  completionOptions={getActiveVariables()}
                />

                <div className='absolute right-5 top-0 cursor-pointer text-slate-400 hover:text-cyan-900'>
                  <CopyToClipboard
                    text={nodeData.requestBody.body}
                    onCopy={() => {
                      setCopyStatus(true);
                      setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
                    }}
                  >
                    <button>
                      {copyStatus ? (
                        <Tippy content='Copied to Clipboard' placement='top'>
                          <ClipboardDocumentCheckIcon className='h-6 w-6' />
                        </Tippy>
                      ) : (
                        <Tippy content='Copy to Clipboard' placement='top'>
                          <ClipboardDocumentIcon className='h-6 w-6' />
                        </Tippy>
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              <Button
                btnType={BUTTON_TYPES.secondary}
                classes={'mt-2'}
                isDisabled={false}
                fullWidth={true}
                onClickHandle={() => {
                  try {
                    const bodyJson = JSON.parse(nodeData.requestBody.body);
                    const prettyBodyJson = JSON.stringify(bodyJson, null, 2);
                    setRequestNodeBody(nodeId, 'raw-json', prettyBodyJson);
                  } catch (e) {
                    toast.error('Unable to beautify. Invalid JSON format.');
                  }
                }}
              >
                Beautify
              </Button>
            </div>
          </div>
        </>
      )}
      {nodeData.requestBody && nodeData.requestBody.type === 'form-data' && (
        <>
          <NodeHorizontalDivider />
          <div className='bg-background pb-2'>
            <div>
              <div className='flex items-center justify-between'>
                <div className='p-2'>Add Param</div>
                <FormDataSelector
                  onSelectHandler={(type) => {
                    const currentParams = nodeData.requestBody.body;
                    const updatedParams = currentParams.concat([{ key: '', value: '', type }]);
                    setRequestNodeBody(nodeId, 'form-data', updatedParams);
                  }}
                />
              </div>
              {renderFormData(nodeData.requestBody.body)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

RequestBody.propTypes = {
  nodeData: PropTypes.object.isRequired,
};

export default RequestBody;
