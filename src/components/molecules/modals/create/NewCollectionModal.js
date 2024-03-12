import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import { PropTypes } from 'prop-types';

const NewCollectionModal = ({ closeFn = () => null, open = false }) => {
  // ToDo: Save the file with the given file name
  // function handleSave() {
  //   setIsNewCollectionModalOpen(false);
  // }

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
                <Dialog.Title
                  as='h3'
                  className='border-b border-neutral-300 pb-4 text-center text-lg font-semibold text-gray-900'
                >
                  Create a new collection
                </Dialog.Title>
                <div className='mt-6'>
                  <input
                    type='text'
                    className='input input-bordered w-full rounded'
                    placeholder='Collection name'
                    required
                  />
                </div>
                <div className='mt-6 flex items-center gap-2'>
                  <Button btnType={BUTTON_TYPES.error} isDisabled={false} onClickHandle={closeFn} fullWidth={true}>
                    Cancel
                  </Button>
                  <Button btnType={BUTTON_TYPES.success} isDisabled={false} fullWidth={true}>
                    Create
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

NewCollectionModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
};

export default NewCollectionModal;
