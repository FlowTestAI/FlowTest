import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
import { XCircleIcon } from '@heroicons/react/20/solid';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import { addLogSyncConfig } from 'service/settings';
import useSettingsStore from 'stores/SettingsStore';

// const schema = z.object({
//   enabled: z.boolean(),
//   accessId: z.string(),
//   accessKey: z.string(),
// });

const SettingsModal = ({ closeFn = () => null, open = false, initialTab = 0 }) => {
  const [successFullSubmissionMessage, showSuccessFullSubmissionMessage] = useState(false);
  const [failureFullSubmissionMessage, showFailureFullSubmissionMessage] = useState(false);
  const config = useSettingsStore((state) => state.logSyncConfig);
  const [enabled, setEnabled] = useState(false);
  const [accessId, setAccessId] = useState('');
  const [accessKey, setAccessKey] = useState('');

  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   setError,
  //   formState: { errors, isSubmitting },
  // } = useForm({
  //   defaultValues: {
  //     enabled: false,
  //     accessId: '',
  //     accessKey: '',
  //   },
  //   resolver: zodResolver(schema),
  // });

  useEffect(() => {
    setEnabled(config?.enabled || false);
    setAccessId(config?.accessId || '');
    setAccessKey(config?.accessKey || '');
  }, [config]);

  const onFormSubmit = async () => {
    try {
      await addLogSyncConfig(enabled, 'https://www.useflowtest.ai', accessId, accessKey);
      // send the form data as a request
      showSuccessFullSubmissionMessage(true);
      closeFn();
    } catch (error) {
      // To show error message from the request handler
      showFailureFullSubmissionMessage(true);
    }
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => {
            setEnabled(config?.enabled || false);
            setAccessId(config?.accessId || '');
            setAccessKey(config?.accessKey || '');
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
                <Dialog.Panel className='h-[40rem] w-full max-w-5xl transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title as='div' className='flex items-center justify-between border-b border-gray-300 pb-4'>
                    <h1 className='text-3xl font-semibold'>Settings</h1>
                    <button onClick={closeFn} className='text-gray-400 hover:text-gray-600'>
                      <XCircleIcon className='h-6 w-6' />
                    </button>
                  </Dialog.Title>
                  <div className='py-4'>
                    <Tab.Group defaultIndex={initialTab}>
                      <Tab.List className='flex'>
                        <Tab
                          className={({ selected }) =>
                            `w-full p-2 ${selected ? 'rounded border border-cyan-900 bg-slate-100' : ''}`
                          }
                        >
                          Scans
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            `w-full p-2 ${selected ? 'rounded border border-cyan-900 bg-slate-100' : ''}`
                          }
                        >
                          Theme
                        </Tab>
                      </Tab.List>
                      <Tab.Panels className='mt-2'>
                        <Tab.Panel className='py-4'>
                          {/* Scans Content */}
                          <div className='bg-card min-h-[20vh] w-full rounded-lg border border-gray-300 p-4 shadow-sm'>
                            <div className='py-2'>
                              <p className='text-lg'>
                                Scans aim to provide anayltics and observability for your flows. <br />
                                <a
                                  href='https://www.useflowtest.ai/'
                                  target='_blank'
                                  rel='noreferrer'
                                  className='text-blue-500 hover:underline'
                                >
                                  Get Access Keys
                                </a>
                              </p>
                            </div>
                            <div className='py-2'>
                              <label htmlFor='enabled' className='block text-lg font-medium text-gray-700'>
                                Enabled
                              </label>
                              <input
                                type='checkbox'
                                checked={enabled}
                                onChange={() => setEnabled(!enabled)}
                                id='enabled'
                                className='block'
                              />
                            </div>
                            <div className='py-2'>
                              <label htmlFor='accessId' className='block text-lg font-medium text-gray-700'>
                                Access Id
                              </label>
                              <input
                                value={accessId}
                                onChange={(e) => setAccessId(e.target.value)}
                                type='text'
                                placeholder='Access Id'
                                className='mb-2 block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
                              />
                            </div>
                            <div className='py-2'>
                              <label htmlFor='accessKey' className='block text-lg font-medium text-gray-700'>
                                Access Key
                              </label>
                              <input
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                type='text'
                                placeholder='Access Key'
                                className='mb-2 block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
                              />
                            </div>
                            <div>
                              {failureFullSubmissionMessage && (
                                <div className='text-red-500'> Failed to saved settings</div>
                              )}
                              {successFullSubmissionMessage && (
                                <div className='text-green-500'> Successfully saved settings</div>
                              )}
                            </div>
                          </div>
                          <div className='mt-6 flex w-full justify-center'>
                            <Button
                              btnType={BUTTON_TYPES.primary}
                              fullWidth={true}
                              onClickHandle={async () => await onFormSubmit()}
                            >
                              {'Save'}
                            </Button>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel className='p-4'>
                          {/* Theme Content */}
                          <form className='flex flex-col items-start gap-4'>
                            <div className='bg-card min-h-[20vh] w-full rounded-lg border border-gray-300 p-4 shadow-sm'>
                              <div className='flex items-center'>
                                <input type='radio' id='light' name='theme' value='light' defaultChecked />
                                <label htmlFor='light' className='ml-2 text-lg'>
                                  Light
                                </label>
                              </div>
                              <div className='flex items-center'>
                                <input type='radio' id='dark' name='theme' value='dark' />
                                <label htmlFor='dark' className='ml-2 text-lg'>
                                  Dark
                                </label>
                              </div>
                              <div className='flex items-center'>
                                <input type='radio' id='system' name='theme' value='system' />
                                <label htmlFor='system' className='ml-2 text-lg'>
                                  System
                                </label>
                              </div>
                            </div>
                          </form>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SettingsModal;
