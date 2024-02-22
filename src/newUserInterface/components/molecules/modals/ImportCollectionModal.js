import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import ImportCollectionTypes from 'newUserInterface/constants/ImportCollectionTypes';
import Modal from './Modal';
import { createCollection } from 'newUserInterface/stores/collections/actions';

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

  const handleOnChangeForImportYaml = (event) => {
    // Un-comment following to read/console the content of the file
    // const reader = new FileReader();
    // reader.readAsText(file, 'UTF-8');
    // reader.onload = (readerEvent) => {
    //   const fileContent = readerEvent.target.result;
    //   console.log('<== fileContent ==>');
    //   console.log(fileContent);
    // };
    const file = event.target.files[0];
    createCollection('/Users/sjain/Desktop/test.yaml', '/Users/sjain/Desktop');
    closeFn();
  };

  return (
    <Modal open={open}>
      <Transition appear show={open} as={Fragment}>
        <Dialog as='div' className='tw-relative tw-z-10' onClose={closeFn}>
          <Transition.Child
            as={Fragment}
            enter='tw-ease-out tw-duration-300'
            enterFrom='tw-opacity-0'
            enterTo='tw-opacity-100'
            leave='tw-ease-in tw-duration-200'
            leaveFrom='tw-opacity-100'
            leaveTo='tw-opacity-0'
          >
            <div className='tw-fixed tw-inset-0 tw-bg-black/25' />
          </Transition.Child>

          <div className='tw-fixed tw-inset-0 tw-overflow-y-auto'>
            <div className='tw-flex tw-min-h-full tw-items-center tw-justify-center tw-p-4 tw-text-center'>
              <Transition.Child
                as={Fragment}
                enter='tw-ease-out tw-duration-300'
                enterFrom='tw-opacity-0 tw-scale-95'
                enterTo='tw-opacity-100 tw-scale-100'
                leave='tw-ease-in tw-duration-200'
                leaveFrom='tw-opacity-100 tw-scale-100'
                leaveTo='tw-opacity-0 tw-scale-95'
              >
                <Dialog.Panel className='tw-w-full tw-max-w-md tw-transform tw-overflow-hidden tw-rounded-2xl tw-bg-white tw-p-6 tw-text-left tw-align-middle tw-shadow-xl tw-transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='tw-border-[rgba(128, 128, 128, 0.35)] tw-border-b tw-pb-4 tw-text-center tw-text-lg tw-font-semibold tw-text-gray-900'
                  >
                    Collections
                  </Dialog.Title>
                  <div className='tw-mt-4'>
                    <ul className='tw-text-sm tw-font-medium'>
                      <li
                        className='tw-flex tw-cursor-pointer tw-items-center tw-justify-start tw-gap-2 tw-rounded-md tw-border tw-border-transparent tw-p-2 hover:tw-bg-slate-100'
                        onClick={handleImportCollectionClick}
                        data-import-type='yaml'
                      >
                        <DocumentArrowUpIcon className='tw-h-4 tw-w-4' />
                        Import a YAML file
                        {/* Ref: https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div */}
                        <input
                          type='file'
                          id='file'
                          ref={importYamlFile}
                          style={{ display: 'none' }}
                          onChange={handleOnChangeForImportYaml}
                        />
                      </li>
                      {/* For future refer */}
                      {/* <li className='tw-flex tw-cursor-pointer tw-items-center tw-justify-start tw-gap-2 tw-p-2 hover:tw-bg-slate-100'>
                      <DocumentArrowUpIcon className='tw-h-4 tw-w-4' />
                      Import from Open API
                      <input
                        type='file'
                        id='file'
                        ref={importYamlFile}
                        style={{ display: 'none' }}
                        onChange={handleOnChangeForImportYaml}
                      />
                    </li>
                    <li className='tw-flex tw-cursor-pointer tw-items-center tw-justify-start tw-gap-2 tw-p-2 hover:tw-bg-slate-100'>
                      <DocumentArrowUpIcon className='tw-h-4 tw-w-4' />
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
    </Modal>
  );
};

export default ImportCollectionModal;
