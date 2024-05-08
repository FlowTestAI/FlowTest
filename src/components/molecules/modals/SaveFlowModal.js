import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { updateEnvironmentFile, updateFlowTest } from 'service/collection';
import { toast } from 'react-toastify';
import { OBJ_TYPES } from 'constants/Common';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';

const SaveFlowModal = ({ tab }) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function saveHandle() {
    if (tab.type == OBJ_TYPES.flowtest && tab.flowDataDraft) {
      updateFlowTest(tab.pathname, tab.flowDataDraft, tab.collectionId)
        .then((result) => {
          console.log(
            `Updated flowtest: path = ${tab.pathname}, collectionId = ${tab.collectionId}, result: ${result}`,
          );
          toast.success(`Updated the flowtest: ${tab.pathname}`);
        })
        .catch((error) => {
          console.log(`Error updating flowtest = ${tab.pathname}: ${error}`);
          toast.error(`Error while updating flowtest: ${tab.pathname}`);
        });
    } else if (tab.type == OBJ_TYPES.environment && tab.variablesDraft) {
      updateEnvironmentFile(tab.name, tab.collectionId, tab.variablesDraft)
        .then((result) => {
          console.log(`Updated environment: name = ${tab.name}, collectionId = ${tab.collectionId}, result: ${result}`);
          toast.success(`Updated environment: ${tab.name}`);
        })
        .catch((error) => {
          console.log(`Error updating environment = ${tab.name}: ${error}`);
          toast.error(`Error while updating environment: ${tab.name}`);
        });
    }
  }

  // ToDo: Save the file with the given file name
  function handleSave() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        btnType={BUTTON_TYPES.secondary}
        isDisabled={false}
        onClickHandle={saveHandle}
        fullWidth={true}
        onlyIcon={true}
        padding={'px-4 py-2.5'}
      >
        <Tippy content='Save' placement='top'>
          <InboxArrowDownIcon className='w-5 h-5' />
        </Tippy>
      </Button>

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
                <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                  <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-centre'>
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
                  <div className='flex items-center gap-2 mt-4'>
                    <Button
                      btnType={BUTTON_TYPES.primary}
                      intentType={BUTTON_INTENT_TYPES.error}
                      isDisabled={false}
                      onClickHandle={closeModal}
                      fullWidth={true}
                    >
                      Cancel
                    </Button>
                    <Button
                      btnType={BUTTON_TYPES.primary}
                      intentType={BUTTON_INTENT_TYPES.success}
                      isDisabled={false}
                      onClickHandle={handleSave}
                      fullWidth={true}
                    >
                      Create
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

SaveFlowModal.propTypes = {
  tab: PropTypes.object.isRequired,
};

export default SaveFlowModal;
