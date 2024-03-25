import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { InboxArrowDownIcon } from '@heroicons/react/20/solid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { updateFlowTest } from 'service/collection';
import { toast } from 'react-toastify';

const SaveFlowModal = ({ tab }) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function saveHandle() {
    updateFlowTest(tab.pathname, tab.flowData, tab.collectionId)
      .then((result) => {
        console.log(`Updated flowtest: path = ${tab.pathname}, collectionId = ${tab.collectionId}, result: ${result}`);
        toast.success(`Updated the flowtest: ${tab.pathname}`);
      })
      .catch((error) => {
        console.log(`Error updating flowtest = ${tab.pathname}: ${error}`);
        toast.error(`Error while updating flowtest: ${tab.pathname}`);
      });
  }

  // ToDo: Save the file with the given file name
  function handleSave() {
    setIsOpen(false);
  }

  return (
    <div>
      <div className='flex items-center justify-center'>
        <button type='button' onClick={saveHandle}>
          <Tippy content='Save' placement='top'>
            <InboxArrowDownIcon className='h-5 w-5' />
          </Tippy>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
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
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title as='h3' className='text-centre text-lg font-medium leading-6 text-gray-900'>
                    Save New Flow Test
                  </Dialog.Title>
                  <div className='mt-2'>
                    <input
                      type='text'
                      id='filename'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-100 dark:focus:ring-blue-100'
                      placeholder='File name'
                      required
                    />
                  </div>
                  <div className='mt-4 flex items-center gap-2'>
                    <button
                      type='button'
                      className='inline-flex w-full grow basis-0 justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className='inline-flex w-full grow basis-0 justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

SaveFlowModal.propTypes = {
  tab: PropTypes.object.isRequired,
};

export default SaveFlowModal;
