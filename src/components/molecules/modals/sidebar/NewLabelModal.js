import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { createFolder, createFlowTest, createEnvironmentFile } from 'service/collection';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';
import { toast } from 'react-toastify';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import TextInput from 'components/atoms/common/TextInput';

const NewLabelModal = ({ closeFn = () => null, open = false, pathName, collectionId, menuOption }) => {
  const [labelValue, setLabelValue] = useState('');
  const [showLabelValueError, setShowLabelValueError] = useState(false);

  const resetFields = () => {
    setLabelValue('');
    setShowLabelValueError(false);
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
                    {`Create a ${menuOption}`}
                  </Dialog.Title>
                  <div className='mt-6'>
                    <TextInput
                      placeHolder={`label`}
                      onChangeHandler={(event) => {
                        const labelValue = event.target.value;
                        setLabelValue(labelValue);
                      }}
                      name={'label'}
                    />
                    {showLabelValueError ? <div className='py-2 text-red-600'>Please provide a label value</div> : ''}
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
                        if (!labelValue || labelValue === '') {
                          setShowLabelValueError(true);
                          return;
                        }
                        console.log(
                          `modalType :: ${menuOption} :: labelValue :: ${labelValue} :: pathName :: ${pathName} :: collectionId :: ${collectionId}`,
                        );
                        if (menuOption === 'new-folder') {
                          createFolder(labelValue, pathName, collectionId)
                            .then((result) => {
                              console.log(
                                `Created a new folder: name = ${labelValue}, path = ${pathName}, collectionId = ${collectionId}, result: ${result} \n`,
                              );
                              toast.success(`Created a new folder: ${labelValue}`);
                            })
                            .catch((error) => {
                              console.log(`Error creating new folder: ${error}`);
                              toast.error(`Error creating new folder`);
                              closeFn();
                            });
                        } else if (menuOption === 'new-flow') {
                          createFlowTest(labelValue, pathName, collectionId)
                            .then((result) => {
                              console.log(
                                `Created a new flowtest: name = ${labelValue}, path = ${pathName}, collectionId = ${collectionId}, result: ${result} \n`,
                              );
                              toast.success(`Created a new flowtest: ${labelValue}`);
                            })
                            .catch((error) => {
                              console.log(`Error creating new flowtest: ${error}`);
                              toast.error(`Error creating new flowtest`);
                              closeFn();
                            });
                        } else if (menuOption === 'collection') {
                          // createCollection();
                          // wont be needing it here but just putting it for testing
                          console.log(`\n Creating a new collection by the name : ${labelValue} \n`);
                        } else if (menuOption === DirectoryOptionsActions.addNewEnvironment.value) {
                          createEnvironmentFile(labelValue, collectionId)
                            .then((result) => {
                              console.log(
                                `Created a new environment: name = ${labelValue}, collectionId = ${collectionId}, result: ${result} \n`,
                              );
                              toast.success(`Created a new environment: ${labelValue}`);
                            })
                            .catch((error) => {
                              console.log(`Error creating new environment: ${error}`);
                              toast.error(`Error while creating new environment`);
                              closeFn();
                            });
                        }
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

NewLabelModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
  pathName: PropTypes.string.isRequired,
  collectionId: PropTypes.string.isRequired,
  menuOption: PropTypes.string.isRequired,
};

export default NewLabelModal;
