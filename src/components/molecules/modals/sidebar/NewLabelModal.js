import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { createFolder, createFlowTest, createEnvironmentFile } from 'service/collection';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';

const NewLabelModal = ({ closeFn = () => null, open = false, pathName, collectionId, menuOption }) => {
  const [labelValue, setLabelValue] = useState('');

  return (
    <div>
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
                    Create a new folder
                  </Dialog.Title>
                  <div className='mt-6'>
                    <input
                      type='text'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-100 dark:focus:ring-blue-100'
                      placeholder='label'
                      required
                      onChange={(event) => {
                        const labelValue = event.target.value;
                        setLabelValue(labelValue);
                      }}
                    />
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
                        console.log(
                          `modalType :: ${menuOption} :: labelValue :: ${labelValue} :: pathName :: ${pathName} :: collectionId :: ${collectionId}`,
                        );
                        if (menuOption === 'new-folder') {
                          createFolder(labelValue, pathName, collectionId)
                            .then((result) => {
                              console.log(
                                `Created a new folder: name = ${labelValue}, path = ${pathName}, collectionId = ${collectionId}, result: ${result} \n`,
                              );
                            })
                            .catch((error) => {
                              // TODO: show error in UI
                              console.log(`Error creating new folder: ${error}`);
                              closeFn();
                            });
                        } else if (menuOption === 'new-flow') {
                          createFlowTest(labelValue, pathName, collectionId)
                            .then((result) => {
                              console.log(
                                `Created a new flowtest: name = ${labelValue}, path = ${pathName}, collectionId = ${collectionId}, result: ${result} \n`,
                              );
                            })
                            .catch((error) => {
                              // TODO: show error in UI
                              console.log(`Error creating new flowtest: ${error}`);
                              closeFn();
                            });
                        } else if (menuOption === 'collection') {
                          // createCollection();
                          // wont be needing it here but just putting it for testing
                          console.log(`\n Creating a new collection by the name : ${labelValue} \n`);
                        } else if (menuOption === DirectoryOptionsActions.addNewEnvironment.value) {
                          console.log(`\n Creating a new environment file by the name : ${labelValue} \n`);
                          createEnvironmentFile(labelValue, collectionId)
                            .then((result) => {
                              console.log(
                                `Created a new environment: name = ${labelValue}, collectionId = ${collectionId}, result: ${result} \n`,
                              );
                            })
                            .catch((error) => {
                              // TODO: show error in UI
                              console.log(`\n \n \n RACHIIIIITT \n \n \n`);
                              console.log(`Error creating new environment: ${error}`);
                              closeFn();
                            });
                        }
                        closeFn();
                      }}
                    >
                      Create
                    </button>
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
