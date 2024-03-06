import React, { Fragment, useState, useRef } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const requestBodyTypeOptions = ['None', 'form-data', 'raw-json', 'raw-txt'];

const RequestBody = ({ nodeData }) => {
  const uploadFileForRequestNode = useRef(null);
  const [bodyType, setBodyType] = useState(nodeData.requestBody ? nodeData.requestBody.type : 'None');

  // form-data
  const [fileName, setFileName] = useState(
    nodeData.requestBody && nodeData.requestBody.body && nodeData.requestBody.body.name
      ? nodeData.requestBody.body.name
      : '',
  );
  const [fileValue, setFileValue] = useState(
    nodeData.requestBody && nodeData.requestBody.body && nodeData.requestBody.body.value
      ? nodeData.requestBody.body.name
      : '',
  );

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

        setFileName(name);
        setFileValue(value);

        if (!nodeData.requestBody.body) {
          nodeData.requestBody.body = {};
        }

        nodeData.requestBody.body.value = value;
        nodeData.requestBody.body.name = name;
      };
      reader.readAsDataURL(file);
    }
  };

  const [fileKey, setFileKey] = useState(
    bodyType === 'form-data' && nodeData.requestBody && nodeData.requestBody.body ? nodeData.requestBody.body.key : '',
  );
  const handleFormDataKey = (e) => {
    if (!nodeData.requestBody.body) {
      nodeData.requestBody.body = {};
    }
    setFileKey(e.target.value);
    nodeData.requestBody.body.key = e.target.value;
  };

  // raw-json
  const [jsonValue, setJsonValue] = useState(
    bodyType === 'raw-json' && nodeData.requestBody && nodeData.requestBody.body ? nodeData.requestBody.body : '{}',
  );

  const handleRawJson = (e) => {
    setJsonValue(e.target.value);
    nodeData.requestBody.body = e.target.value;
  };

  const handleClose = (option) => {
    nodeData.requestBody = {};
    nodeData.requestBody.type = option;
    setBodyType(option);

    //console.log(`handleClose:: ${option}`);

    if (option == 'raw-json') {
      nodeData.requestBody.body = jsonValue;
    } else if (option == 'form-data') {
      nodeData.requestBody.body = {};
      nodeData.requestBody.body.key = fileKey;
      nodeData.requestBody.body.value = fileValue;
      nodeData.requestBody.body.name = fileName;
    }
  };

  return (
    <>
      <div className='tw-border-t tw-border-neutral-300 tw-bg-slate-100 tw-px-2 tw-py-4'>
        <div className='tw-flex tw-items-center tw-justify-between tw-font-medium'>
          <h3>Body</h3>
          <Menu as='div' className='tw-relative tw-inline-block tw-text-left'>
            <Menu.Button data-click-from='body-type-menu' className='tw-p-2'>
              <EllipsisVerticalIcon className='tw-h-4 tw-w-4' aria-hidden='true' data-click-from='body-type-menu' />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='tw-transition tw-ease-out tw-duration-100'
              enterFrom='tw-transform tw-opacity-0 tw-scale-95'
              enterTo='tw-transform tw-opacity-100 tw-scale-100'
              leave='tw-transition tw-ease-in tw-duration-75'
              leaveFrom='tw-transform tw-opacity-100 tw-scale-100'
              leaveTo='tw-transform tw-opacity-0 tw-scale-95'
            >
              <Menu.Items
                className='tw-focus:outline-none tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-divide-y tw-divide-gray-100 tw-rounded-md tw-bg-white tw-px-1 tw-py-1 tw-shadow-lg tw-ring-1 tw-ring-black/5'
                data-click-from='body-type-menu'
              >
                {requestBodyTypeOptions.map((bodyTypeOption, index) => (
                  <Menu.Item key={index} data-click-from='body-type-menu' onClick={() => handleClose(bodyTypeOption)}>
                    <button
                      className='tw-group tw-flex tw-w-full tw-items-center tw-rounded-md tw-px-2 tw-py-2 tw-text-sm tw-text-gray-900 hover:tw-bg-slate-100'
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
      </div>
      {bodyType === 'raw-json' && (
        <div className='tw-border tw-border-t tw-border-neutral-300 tw-bg-slate-50 tw-p-2'>
          <textarea
            placeholder={bodyType}
            className='nodrag nowheel tw-w-full tw-p-2'
            name='username'
            onChange={(e) => handleRawJson(e)}
            rows={4}
            value={jsonValue}
          />
        </div>
      )}
      {bodyType === 'form-data' && (
        <div className='tw-border-t tw-border-neutral-300 tw-bg-slate-50 tw-p-2'>
          <div className='tw-flex tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-neutral-500 tw-text-sm tw-text-neutral-500 tw-outline-0 focus:tw-ring-0'>
            <input
              placeholder='key'
              className='nodrag nowheel tw-bg-slate-50 tw-pl-4'
              name='variable-value'
              onChange={(e) => handleFormDataKey(e)}
              value={fileKey}
            />
            <div className='tw-rounded-br-md tw-rounded-tr-md tw-border-l tw-border-l-neutral-500 tw-px-4 tw-py-2'>
              File
            </div>
          </div>
          <div className='tw-py-2'>
            <button
              className='tw-flex tw-w-full tw-cursor-pointer tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-border tw-border-neutral-500 tw-bg-slate-100 tw-p-2 hover:tw-bg-slate-200'
              onClick={() => {
                uploadFileForRequestNode.current.click();
              }}
            >
              <DocumentArrowUpIcon className='tw-h-4 tw-w-4 tw-text-center' />
              Upload File
              {/* Ref: https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div */}
              <div className='tw-hidden'>
                <input type='file' id='file' ref={uploadFileForRequestNode} onChange={handleFileUpload} />
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestBody;
