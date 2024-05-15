import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { createFolder, createFlowTest, createEnvironmentFile } from 'service/collection';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';
import { toast } from 'react-toastify';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES, OBJ_TYPES } from 'constants/Common';
import TextInput from 'components/atoms/common/TextInput';
import Collection from '../../sidebar/content/Collection';
import useCollectionStore from 'stores/CollectionStore';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { isEmpty } from 'lodash';
import TimeoutSelector from 'components/atoms/common/TimeoutSelector';
import { timeoutForGraphRun } from 'components/molecules/flow/utils';

const NewEnvironmentFileModal = ({ closeFn = () => null, open = false }) => {
  const collections = useCollectionStore.getState().collections;

  const [environmentFileName, setEnvironmentFileName] = useState('');
  const [selectedCollection, setSelectionCollection] = useState({});
  const [showEnvironmentFileNameError, setShowEnvironmentFileNameError] = useState(false);
  const [showCollectionSelectionError, setShowCollectionSelectionError] = useState(false);

  const resetFields = () => {
    setEnvironmentFileName('');
    setSelectionCollection({});
    setShowEnvironmentFileNameError(false);
    setShowCollectionSelectionError(false);
  };

  return (
    <div>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => {
            resetFields();
            closeFn();
          }}
        >
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
                  <Dialog.Title as='h3' className='pb-4 text-lg font-semibold text-center border-b border-gray-300'>
                    {`Create a new environment file`}
                  </Dialog.Title>
                  <div className='flex flex-col gap-6 py-6'>
                    <div>
                      <TextInput
                        placeHolder={`File Name`}
                        onChangeHandler={(event) => {
                          const fileName = event.target.value;
                          setEnvironmentFileName(fileName);
                        }}
                        name={'environment-file-name'}
                      />
                      {environmentFileName.trim() === '' && showEnvironmentFileNameError ? (
                        <div className='py-2 text-red-600'>Please provide a name for your new environment file</div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div>
                      <div className='flex justify-between gap-2 transition border rounded bg-background-light hover:bg-background whitespace-nowrap border-cyan-900 text-cyan-900'>
                        <Listbox
                          value={selectedCollection}
                          onChange={(value) => {
                            setSelectionCollection(value);
                          }}
                        >
                          <div className='relative flex w-full h-full'>
                            <Listbox.Button className='flex w-full items-center justify-between gap-1 px-4 py-2.5 sm:text-sm'>
                              {!isEmpty(selectedCollection) ? selectedCollection.name : 'Select Collection'}
                              <ChevronUpDownIcon className='w-5 h-5' aria-hidden='true' />
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave='transition ease-in duration-100'
                              leaveFrom='opacity-100'
                              leaveTo='opacity-0'
                            >
                              <Listbox.Options className='absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded shadow-lg top-10 max-h-60 ring-1 ring-black/5'>
                                {collections.map((collection, index) => {
                                  return (
                                    <Listbox.Option
                                      key={index}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 hover:font-semibold ${
                                          active ? 'bg-background-light text-slate-900' : ''
                                        }`
                                      }
                                      value={collection}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                          >
                                            {collection.name}
                                          </span>
                                          {selected ? (
                                            <span className='absolute inset-y-0 left-0 flex items-center pl-3 font-semibold'>
                                              <CheckIcon className='w-5 h-5' aria-hidden='true' />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  );
                                })}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      {isEmpty(selectedCollection) && showCollectionSelectionError ? (
                        <div className='py-2 text-red-600'>
                          Please provide a collection in which you wants to create your new environment file
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mt-6'>
                    <Button
                      btnType={BUTTON_TYPES.secondary}
                      intentType={BUTTON_INTENT_TYPES.error}
                      isDisabled={false}
                      onClickHandle={() => {
                        resetFields();
                        closeFn();
                      }}
                      fullWidth={true}
                    >
                      Cancel
                    </Button>
                    <Button
                      btnType={BUTTON_TYPES.primary}
                      isDisabled={false}
                      onClickHandle={() => {
                        if (!environmentFileName || environmentFileName.trim() === '') {
                          setShowEnvironmentFileNameError(true);
                          return;
                        }
                        if (!selectedCollection || !selectedCollection.id || selectedCollection.id === '') {
                          setShowCollectionSelectionError(true);
                          return;
                        }
                        setShowEnvironmentFileNameError(false);
                        setShowCollectionSelectionError(false);
                        createEnvironmentFile(environmentFileName, selectedCollection.id)
                          .then((result) => {
                            toast.success(`Created a new environment: ${environmentFileName}`);
                          })
                          .catch((error) => {
                            console.log(`Error creating new environment: ${error}`);
                            toast.error(`Error while creating new environment`);
                            closeFn();
                          });
                        resetFields();
                        closeFn();
                      }}
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
    </div>
  );
};

export default NewEnvironmentFileModal;
