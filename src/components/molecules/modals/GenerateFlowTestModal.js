import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';

const GenerateFlowTestModal = ({ closeFn = () => null, open = false }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [textareaValue, setTextareaValue] = useState('');

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
              <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='pb-4 text-lg font-semibold text-center text-gray-900 border-b border-neutral-300'
                >
                  Use our AI to generate the flowtest
                </Dialog.Title>
                <div className='mt-6'>
                  <Listbox value={selectedModel} onChange={setSelectedModel}>
                    <div className='relative flex w-full h-full'>
                      <Listbox.Button className='flex items-center justify-between w-full gap-4 py-4 border rounded cursor-default border-neutral-300'>
                        <div className='pl-2 text-left min-w-32'>{selectedModel ? selectedModel : 'Select model'}</div>
                        <ChevronUpDownIcon className='w-5 h-5' aria-hidden='true' />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded shadow-lg top-6 max-h-60 ring-1 ring-black/5'>
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                              }`
                            }
                            value={'Model 1'}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  Model 1
                                </span>
                                {selected ? (
                                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                                    <CheckIcon className='w-5 h-5' aria-hidden='true' />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                              }`
                            }
                            value={'Model 2'}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  Model 2
                                </span>
                                {selected ? (
                                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                                    <CheckIcon className='w-5 h-5' aria-hidden='true' />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  <div className='mt-4'>
                    <textarea
                      id='gen-ai-text'
                      className='block w-full rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
                      placeholder='Text'
                      onChange={(event) => setTextareaValue(event.target.value)}
                    />
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-6'>
                  <Button btnType={BUTTON_TYPES.error} isDisabled={false} onClickHandle={closeFn} fullWidth={true}>
                    Cancel
                  </Button>
                  <Button
                    btnType={BUTTON_TYPES.info}
                    isDisabled={false}
                    fullWidth={true}
                    onClickHandle={() => {
                      console.log(`\n Model selected : ${selectedModel} \n`);
                      console.log(`\n Model Text : ${textareaValue} \n`);
                    }}
                  >
                    Generate
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

GenerateFlowTestModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
};
export default GenerateFlowTestModal;
