import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES, GENAI_MODELS } from 'constants/Common';
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

const GenerateFlowTestModal = ({ closeFn = () => null, open = false, collectionId }) => {
  const setShowLoader = useCommonStore((state) => state.setShowLoader);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);

  const [selectedModel, setSelectedModel] = useState(null);
  const [textareaValue, setTextareaValue] = useState('');

  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);

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
              <Dialog.Panel className='w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='pb-4 text-lg font-semibold text-center text-gray-900 border-b border-neutral-300'
                >
                  Use our AI to generate the flow
                </Dialog.Title>
                <div className='mt-6'>
                  <Listbox value={selectedModel} onChange={setSelectedModel}>
                    <div className='relative flex w-full h-full'>
                      <Listbox.Button className='flex items-center justify-between w-full gap-4 px-2 py-4 border rounded cursor-default border-neutral-300'>
                        <div className='pl-2 text-left min-w-32'>{selectedModel ? selectedModel : 'Select model'}</div>
                        <ChevronUpDownIcon className='w-5 h-5' aria-hidden='true' />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded shadow-lg top-12 max-h-60 ring-1 ring-black/5'>
                          {Object.values(GENAI_MODELS).map((modelType) => (
                            <Listbox.Option
                              key={modelType}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={modelType}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {modelType}
                                  </span>
                                  {selected ? (
                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                                      <CheckIcon className='w-5 h-5' aria-hidden='true' />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  {selectedModel === GENAI_MODELS.openai ? (
                    <div className='flex items-center justify-center w-full h-12 mt-8 text-sm border rounded-md border-neutral-500 text-neutral-500 outline-0 focus:ring-0'>
                      <label
                        className='flex items-center w-32 h-full px-4 border-r border-r-neutral-500'
                        htmlFor='openAIkey'
                      >
                        OpenAI Key
                      </label>
                      <input
                        id='openAIkey'
                        type='text'
                        className='nodrag nowheel block w-full p-2.5'
                        name='keyName'
                        placeholder='Enter your Open AI key'
                        value={collection ? collection.dotEnvVariables['OPENAI_APIKEY'] : ''}
                        readOnly='readonly'
                        //onChange={(e) => setOpenAIKey(e.target.value)}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='mt-8'>
                    <textarea
                      id='gen-ai-text'
                      className='block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded min-h-80 bg-gray-50 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
                      placeholder='Describe your flow step by step'
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
                      if (textareaValue.trim() === '') {
                        toast.info('Please describe your flow');
                      } else if (selectedModel === null) {
                        toast.info('Please select a model');
                      } else {
                        setShowLoader(true);
                        promiseWithTimeout(generateFlowData(textareaValue, selectedModel, collectionId), 30000)
                          .then((flowData) => {
                            setShowLoader(false);
                            if (isEqual(flowData.nodes, [])) {
                              toast.info(`${selectedModel} was not able to evaluate the instructions properly`);
                            } else {
                              const result = init(flowData);
                              setNodes(result.nodes);
                              setEdges(result.edges);
                            }
                            closeFn();
                          })
                          .catch((error) => {
                            setShowLoader(false);
                            toast.error(`Error while generating flow data ${error}`);
                            closeFn();
                          });
                      }
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
