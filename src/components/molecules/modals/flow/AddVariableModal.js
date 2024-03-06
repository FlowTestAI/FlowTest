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
                <Dialog.Panel className='tw-w-full tw-max-w-min tw-transform tw-overflow-hidden tw-rounded-2xl tw-bg-white tw-p-6 tw-text-left tw-align-middle tw-shadow-xl tw-transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='tw-border-[rgba(128, 128, 128, 0.35)] tw-border-b tw-pb-4 tw-text-center tw-text-lg tw-font-semibold tw-text-gray-900'
                  >
                    Create a new variable for request node
                  </Dialog.Title>
                  <div className='tw-mt-6 tw-flex tw-w-24 tw-min-w-[40vw] tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-neutral-500 tw-text-sm tw-text-neutral-500 tw-outline-0 focus:tw-ring-0'>
                    <input
                      id='keyName'
                      type='text'
                      className='nodrag nowheel tw-block tw-h-12 tw-w-full tw-rounded-bl-md tw-rounded-tl-md  tw-p-2.5'
                      name='keyName'
                      placeholder='Enter variable name'
                      onChange={(e) => setVariableName(e.target.value)}
                    />
                    <select
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        //console.log(`variable type selected: ${selectedValue}`);
                        setVariableType(selectedValue);
                      }}
                      name='var-input-type'
                      defaultValue={variableType}
                      className='nodrag tw-h-12 tw-w-full tw-max-w-[30%] tw-rounded-br-md tw-rounded-tr-md tw-border-l tw-border-l-neutral-500 tw-p-0 tw-px-1'
                    >
                      {variableTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                      onClick={() => {
                        if (variableName.trim() != '') {
                          // console.log(`Adding ${variableName} && ${variableType}`);
                          // setVariableModalData(variableName, variableType);
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
