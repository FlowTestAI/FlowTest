import React, { useState, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import 'tippy.js/dist/tippy.css';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import TextInputWithLabel from 'components/atoms/common/TextInputWithLabel';

export const variableTypes = [
  {
    value: 'String',
    label: 'String',
  },
  {
    value: 'Select',
    label: 'Select',
  },
  {
    value: 'Number',
    label: 'Number',
  },
  {
    value: 'Boolean',
    label: 'Boolean',
  },
  {
    value: 'Now',
    label: 'Now',
  },
];

const AddVariableModal = ({ closeFn = () => null, open = false, modalType, onVariableAdd }) => {
  const [variableName, setVariableName] = useState('');
  const [variableType, setVariableType] = useState('String');

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
              <Dialog.Panel className='w-full p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl max-w-min'>
                <Dialog.Title as='h3' className='pb-4 text-lg font-semibold text-center border-b border-gray-300'>
                  Create a new variable
                </Dialog.Title>

                <div className='order bg-background-light mt-6 flex w-24 min-w-[40vw] items-center justify-center rounded border border-slate-700 p-2.5 text-sm text-slate-900 outline-none'>
                  <input
                    id='keyName'
                    type='text'
                    className='block w-full h-12 bg-transparent outline-none nodrag nowheel'
                    name='keyName'
                    placeholder='Enter variable name'
                    onChange={(e) => setVariableName(e.target.value)}
                  />
                  <select
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      setVariableType(selectedValue);
                    }}
                    name='var-input-type'
                    defaultValue={variableType}
                    className='nodrag h-12 w-full max-w-[30%] border-l border-slate-700 bg-transparent p-0 px-1 outline-none'
                  >
                    {variableTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex items-center gap-2 mt-6'>
                  <Button
                    btnType={BUTTON_TYPES.secondary}
                    intentType={BUTTON_INTENT_TYPES.error}
                    isDisabled={false}
                    onClickHandle={closeFn}
                    fullWidth={true}
                  >
                    Cancel
                  </Button>
                  <Button
                    btnType={BUTTON_TYPES.primary}
                    isDisabled={false}
                    onClickHandle={() => {
                      if (variableName.trim() != '') {
                        onVariableAdd(modalType, variableName, variableType);
                      }
                      closeFn();
                    }}
                    fullWidth={true}
                  >
                    Add variable
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

AddVariableModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
  onVariableAdd: PropTypes.func.isRequired,
};

export default AddVariableModal;
