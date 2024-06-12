import React, { Fragment, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentArrowUpIcon, CheckIcon } from '@heroicons/react/24/outline';
import ImportCollectionTypes from 'constants/ImportCollectionTypes';
import { openCollection } from 'service/collection';
import { toast } from 'react-toastify';

const OpenCollectionModal = ({ closeFn = () => null, open = false }) => {
  const [selectedFilePath, setSelectedFilePath] = useState('');
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
    setSelectedFilePath(yamlPath);
  };

  const handleDirectorySelectionClick = async () => {
    // This solution will only work in Electron not in webapp
    selectDirectory()
      .then((dirPath) => {
        // if user presses cancel in choosing directory dialog, this is returned undefined
        if (dirPath) {
          openCollection(selectedFilePath, dirPath).catch((error) => {
            console.log(`Failed to open collection: ${error}`);
            toast.error('Failed to create the collection');
          });
        }
      })
      .catch((error) => {
        console.log(`Failed to open collection: ${error}`);
        toast.error('Failed to open the collection');
      });

    //resetting data
    setSelectedFilePath('');
    closeFn();
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
              <Dialog.Panel className='w-full max-w-xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                <Dialog.Title as='h3' className='pb-4 text-lg font-semibold text-center border-b border-gray-300'>
                  Open a Collection
                </Dialog.Title>
                {/* ToDo: Add the message of instructions here, if that is not required then we can remove this div */}
                {/* <div className='mt-4'>
                  <p> Message or instructions here</p>
                </div> */}
                <div className='mt-4'>
                  <ul className='text-lg font-medium'>
                    <li
                      className={`cursor-pointer rounded border border-transparent px-2 py-4 hover:bg-background-light ${selectedFilePath ? 'text-green-500' : ''}`}
                      onClick={handleImportCollectionClick}
                      data-import-type='yaml'
                    >
                      <div className='flex items-center justify-start gap-4'>
                        <div
                          className={`${selectedFilePath ? 'border-green-600 bg-green-500 text-white before:h-40' : 'border-cyan-900 before:h-[38px]'} relative flex h-8 w-8 items-center justify-center rounded-full border-4 before:absolute before:left-[10px] before:top-[27px] before:w-[4px] before:bg-cyan-900 before:opacity-100`}
                        >
                          {selectedFilePath ? <CheckIcon className='w-5 h-5' /> : '1'}
                        </div>
                        <div className='flex items-center justify-start'>
                          {/* <DocumentArrowUpIcon className='w-4 h-4' /> */}
                          Import an OpenAPI V3 spec
                          {/* Ref: https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div */}
                          <div className='hidden'>
                            <input
                              type='file'
                              id='file'
                              accept='.yaml,.yml,.json'
                              ref={importYamlFile}
                              onChange={handleFileSelection}
                            />
                          </div>
                        </div>
                      </div>

                      {selectedFilePath ? (
                        <div className='px-2 py-4 my-4 ml-12 text-green-600 bg-green-100 border border-green-600 rounded'>
                          {selectedFilePath}
                        </div>
                      ) : (
                        ''
                      )}
                    </li>
                    <li
                      className={`flex cursor-pointer items-center justify-start gap-4 px-2 py-4 hover:bg-background-light ${selectedFilePath ? 'cursor-default' : 'cursor-not-allowed'}`}
                      onClick={handleDirectorySelectionClick}
                    >
                      <div className='flex items-center justify-center w-8 h-8 border-4 rounded-full border-cyan-900'>
                        2
                      </div>
                      <div
                        className={`flex items-center justify-start ${selectedFilePath ? 'cursor-default' : 'cursor-not-allowed text-gray-400'}`}
                      >
                        {/* <FolderPlusIcon className='w-5 h-5' /> */}
                        Select the directory of an existing collection
                      </div>
                    </li>
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

OpenCollectionModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
};

export default OpenCollectionModal;
