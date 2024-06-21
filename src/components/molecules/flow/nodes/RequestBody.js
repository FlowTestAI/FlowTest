import React, { Fragment, useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { DocumentArrowUpIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
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

const requestBodyTypeOptions = ['None', 'form-data', 'raw-json'];

const RequestBody = ({ nodeId, nodeData }) => {
  const setRequestNodeBody = useCanvasStore((state) => state.setRequestNodeBody);
  const [cachedValues, setCachedValues] = React.useState({});

  const [textToCopy, setTextToCopy] = useState(nodeData.requestBody.body); // The text you want to copy
  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied
  const [showCopiedToClipboardToolTip, setShowCopiedToClipboardToolTip] = useState(false);

  const uploadFileForRequestNode = useRef(null);

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

  const handleFileUpload = async (e) => {
    if (!e.target.files) return;

    if (e.target.files.length === 1) {
      const file = e.target.files[0];
      const { name } = file;

      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;

        const value = result;

        setRequestNodeBody(nodeId, 'form-data', {
          key: nodeData.requestBody.body.key,
          value: value,
          name: name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormDataKey = (e) => {
    setRequestNodeBody(nodeId, 'form-data', {
      key: e.target.value,
      value: nodeData.requestBody.body.value,
      name: nodeData.requestBody.body.name,
    });
  };

  const handleRawJson = async (value) => {
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
        setRequestNodeBody(nodeId, option, {
          key: '',
          value: '',
          name: '',
        });
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

  const onCopyText = () => {
    setCopyStatus(true);
    setShowCopiedToClipboardToolTip(true);
    setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
    setTimeout(() => setShowCopiedToClipboardToolTip(false), 2000); // Reset status after 2 seconds
  };

  return (
    <>
      <div className='flex items-center justify-between bg-background p-4'>
        <h3>Body</h3>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button data-click-from='body-type-menu'>
            <EllipsisVerticalIcon className='h-4 w-4' aria-hidden='true' data-click-from='body-type-menu' />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items
              className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white px-1 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none'
              data-click-from='body-type-menu'
            >
              {requestBodyTypeOptions.map((bodyTypeOption, index) => (
                <Menu.Item key={index} data-click-from='body-type-menu' onClick={() => handleClose(bodyTypeOption)}>
                  <button
                    className='group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-background-light'
                    data-click-from='body-type-menu'
                  >
                    {bodyTypeOption}
                  </button>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {nodeData.requestBody && nodeData.requestBody.type === 'raw-json' && (
        <>
          <NodeHorizontalDivider />
          <div className='bg-background p-4'>
            <div className='nodrag nowheel w-full min-w-72'>
              <div className='relative bg-background-lighter'>
                <Editor
                  name='request-body-json'
                  onChange={async (e) => {
                    await handleRawJson(e);
                    setTextToCopy(e);
                  }}
                  value={nodeData.requestBody.body}
                  classes={'w-full max-h-96'}
                  completionOptions={getActiveVariables()}
                />

                <div className='absolute right-5 top-0 cursor-pointer text-slate-400 hover:text-cyan-900'>
                  <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                    <button>
                      <Tippy
                        content='Copied to Clipboard'
                        placement='top'
                        visible={showCopiedToClipboardToolTip}
                        onClickOutside={() => setShowCopiedToClipboardToolTip(false)}
                      >
                        <ClipboardDocumentCheckIcon className='h-6 w-6' />
                      </Tippy>
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
          <div className='bg-background p-4'>
            <TextInputWithLabel
              placeHolder='key'
              onChangeHandler={(e) => handleFormDataKey(e)}
              name={'variable-value'}
              value={nodeData.requestBody.body.key}
              label={'File'}
            />
            <div className='pt-4'>
              <Button
                btnType={BUTTON_TYPES.secondary}
                isDisabled={false}
                onClickHandle={() => {
                  uploadFileForRequestNode.current.click();
                }}
                fullWidth={true}
              >
                <DocumentArrowUpIcon className='h-4 w-4 text-center' />
                Upload File
                {/* Ref: https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div */}
                <div className='hidden'>
                  <input type='file' id='file' ref={uploadFileForRequestNode} onChange={handleFileUpload} />
                </div>
              </Button>
              <div className='pt-1 text-center'>
                {nodeData.requestBody.body.name != '' ? nodeData.requestBody.body.name : 'Choose a file to upload'}
              </div>
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
