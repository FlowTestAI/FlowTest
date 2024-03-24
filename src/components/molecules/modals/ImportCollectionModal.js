import React, { Fragment, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import ImportCollectionTypes from 'constants/ImportCollectionTypes';
import { createCollection } from 'service/collection';
import { toast } from 'react-toastify';

const ImportCollectionModal = ({ closeFn = () => null, open = false }) => {
  const importYamlFile = useRef(null);
  const handleImportCollectionClick = (event) => {
    const elem = event.currentTarget;
    const importType = elem.dataset.importType;
    importCollectionByType(importType);
  };

  const importCollectionByType = (importTypeVal) => {
    switch (importTypeVal) {
      case ImportCollectionTypes.YAML:
        importCollectionByYaml();
        break;
    }
  };

  const importCollectionByYaml = () => {
    importYamlFile.current.click();
  };

  const selectDirectory = () => {
    const { ipcRenderer } = window;

    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:open-directory-selection-dialog').then(resolve).catch(reject);
    });
  };

  const handleFileSelection = async (event) => {
    const yamlPath = event.target.files[0].path;

    closeFn();

    // This solution will only work in Electron not in webapp
    selectDirectory()
      .then((dirPath) => {
        // if user presses cancel in choosing directory dialog, this is returned undefined
        if (dirPath) {
          createCollection(yamlPath, dirPath);
          toast.success('Successfully created the collection');
        }
      })
      .catch((error) => {
        toast.error('Failed to create the collection');
      });
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeFn}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='pb-4 text-lg font-semibold text-center text-gray-900 border-b border-neutral-300'
                >
                  Collections
                </Dialog.Title>
                <div className='mt-4'>
                  <ul className='text-sm font-medium'>
                    <li
                      className='flex items-center justify-start gap-2 p-2 border border-transparent rounded-md cursor-pointer hover:bg-slate-100'
                      onClick={handleImportCollectionClick}
                      data-import-type='yaml'
                    >
                      <DocumentArrowUpIcon className='w-4 h-4' />
                      Import an OpenAPI spec to start a new collection
                      {/* Ref: https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div */}
                      <div className='hidden'>
                        <input
                          type='file'
                          id='file'
                          accept='.yaml,.yml'
                          ref={importYamlFile}
                          onChange={handleFileSelection}
                        />
                      </div>
                    </li>
                    {/* For future refer */}
                    {/* <li className='flex items-center justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100'>
                      <DocumentArrowUpIcon className='w-4 h-4' />
                      Import from Open API
                      <input
                        type='file'
                        id='file'
                        ref={importYamlFile}
                        style={{ display: 'none' }}
                        onChange={handleOnChangeForImportYaml}
                      />
                    </li>
                    <li className='flex items-center justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100'>
                      <DocumentArrowUpIcon className='w-4 h-4' />
                      Import from Postman
                      <input
                        type='file'
                        id='file'
                        ref={importYamlFile}
                        style={{ display: 'none' }}
                        onChange={handleOnChangeForImportYaml}
                      />
                    </li> */}
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

ImportCollectionModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
};

export default ImportCollectionModal;
