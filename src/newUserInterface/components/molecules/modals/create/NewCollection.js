import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { InboxArrowDownIcon } from '@heroicons/react/20/solid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Modal from 'newUserInterface/components/molecules/modals/Modal';

const NewCollection = ({ closeFn = () => null, open = false }) => {
  // ToDo: Save the file with the given file name
  // function handleSave() {
  //   setIsNewCollectionModalOpen(false);
  // }

  return (
    <Modal open={open}>
      <div>
        <div className='tw-flex tw-items-center tw-justify-center'>
          <button type='button' onClick={open}>
            <Tippy content='Save' placement='top'>
              <InboxArrowDownIcon className='tw-h-5 tw-w-5' />
            </Tippy>
          </button>
        </div>

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
                      Create a new collection
                    </Dialog.Title>
                    <div className='tw-mt-6'>
                      <input
                        type='text'
                        className='tw-focus:ring-blue-100 tw-focus:border-blue-100 tw-dark:bg-gray-700 tw-dark:border-gray-600 tw-dark:placeholder-gray-400 tw-dark:text-white tw-dark:focus:ring-blue-100 tw-dark:focus:border-blue-100 w-full tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-2.5 tw-text-sm tw-text-gray-900 tw-outline-blue-300'
                        placeholder='label'
                        required
                      />
                    </div>
                    <div className='items-center tw-mt-6 tw-flex tw-gap-2'>
                      <button
                        type='button'
                        className='tw-inline-flex tw-w-full tw-grow tw-basis-0 tw-justify-center tw-rounded-md tw-border tw-border-transparent tw-bg-sky-100 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-blue-900 hover:tw-bg-sky-300'
                        onClick={closeFn}
                      >
                        Cancel
                      </button>
                      <button
                        type='button'
                        className='tw-inline-flex tw-w-full tw-grow tw-basis-0 tw-justify-center tw-rounded-md tw-border tw-border-transparent tw-bg-green-100 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-green-900 hover:tw-bg-green-400'
                      >
                        Create
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </Modal>
  );
};

export default NewCollection;
