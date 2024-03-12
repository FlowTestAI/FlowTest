import React, { useState, Fragment } from 'react';
import Modal from 'components/molecules/modals/Modal';
import { Dialog, Transition } from '@headlessui/react';
import 'tippy.js/dist/tippy.css';

const variableTypes = [
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
];

const AddVariableModal = ({ closeFn = () => null, open = false, onVariableAdd }) => {
  const [variableName, setVariableName] = useState('');
  const [variableType, setVariableType] = useState('String');

  return (
    <Modal open={open}>
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
                <Dialog.Panel className='w-full p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl max-w-min rounded-2xl'>
                  <Dialog.Title
                    as='h3'
                    className='pb-4 text-lg font-semibold text-center text-gray-900 border-b border-neutral-300'
                  >
                    Create a new variable for request node
                  </Dialog.Title>
                  <div className='mt-6 flex w-24 min-w-[40vw] items-center justify-center rounded-md border border-neutral-500 text-sm text-neutral-500 outline-0 focus:ring-0'>
                    <input
                      id='keyName'
                      type='text'
                      className='nodrag nowheel block h-12 w-full rounded-bl-md rounded-tl-md  p-2.5'
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
                      className='nodrag h-12 w-full max-w-[30%] rounded-br-md rounded-tr-md border-l border-l-neutral-500 p-0 px-1'
                    >
                      {variableTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex items-center gap-2 mt-6'>
                    <button
                      type='button'
                      className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-900 border border-transparent rounded-md grow basis-0 bg-sky-100 hover:bg-sky-300'
                      onClick={closeFn}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md grow basis-0 hover:bg-green-400'
                      onClick={() => {
                        if (variableName.trim() != '') {
                          onVariableAdd(variableName, variableType);
                        }
                        closeFn();
                      }}
                    >
                      Add variable
                    </button>
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

export default AddVariableModal;
