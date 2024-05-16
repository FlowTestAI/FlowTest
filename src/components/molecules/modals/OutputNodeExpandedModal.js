import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES, GENAI_MODELS } from 'constants/Common';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { generateFlowData } from '../flow/flowtestai';
import { init } from '../flow';
import useCanvasStore from 'stores/CanvasStore';
import { toast } from 'react-toastify';
import { isEqual } from 'lodash';
import useCommonStore from 'stores/CommonStore';
import useCollectionStore from 'stores/CollectionStore';
import { promiseWithTimeout } from 'utils/common';
import { Editor } from 'components/atoms/Editor';

const OuputNodeExpandedModal = ({ closeFn = () => null, open = false, data }) => {
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
              <Dialog.Panel className='w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                <Dialog.Title as='h3' className='pb-4 text-lg font-semibold text-center border-b border-gray-300'>
                  Ouput
                </Dialog.Title>
                <div className='mt-6'>
                  <Editor
                    name='output-text'
                    value={JSON.stringify(data, null, 2)}
                    readOnly={true}
                    classes={'w-[600px] h-[600px'}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

OuputNodeExpandedModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
};
export default OuputNodeExpandedModal;
