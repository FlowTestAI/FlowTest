import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { XCircleIcon } from '@heroicons/react/20/solid';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import { addLogSyncConfig } from 'service/settings';
import useSettingsStore from 'stores/SettingsStore';

const schema = z.object({
  enabled: z.boolean(),
  accessId: z.string(),
  accessKey: z.string(),
});

const SettingsModal = ({ closeFn = () => null, open = false, initialTab = 0 }) => {
  const [successFullSubmissionMessage, showSuccessFullSubmissionMessage] = useState(false);
  const config = useSettingsStore((state) => state.logSyncConfig);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      enabled: false,
      accessId: '',
      accessKey: '',
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue('enabled', config?.enabled || false);
    setValue('accessId', config?.accessId || '');
    setValue('accessKey', config?.accessKey || '');
  }, [config]);

  const onFormSubmit = async (data) => {
    try {
      await addLogSyncConfig(data.enabled, 'http://localhost:3000', data.accessId, data.accessKey);
      // send the form data as a request
      showSuccessFullSubmissionMessage(true);
      closeFn();
    } catch (error) {
      // To show error message from the request handler
      setError('root', { message: error });
    }
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => {
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
                <Dialog.Panel className='w-full max-w-5xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                  <Dialog.Title as='div' className='flex items-center justify-between pb-4 border-b border-gray-300'>
                    <h1 className='text-3xl font-semibold'>Settings</h1>
                    <button onClick={closeFn} className='text-gray-400 hover:text-gray-600'>
                      <XCircleIcon className='w-6 h-6' />
                    </button>
                  </Dialog.Title>
                  <Tab.Group defaultIndex={initialTab}>
                    <Tab.List className='flex p-1 space-x-1 rounded-xl bg-blue-900/20'>
                      <Tab
                        className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                          ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                        }
                      >
                        Scans
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                          ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                        }
                      >
                        Theme
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className='mt-2'>
                      <Tab.Panel className='p-4'>
                        {/* Scans Content */}
                        <form className='flex flex-col items-start gap-4' onSubmit={handleSubmit(onFormSubmit)}>
                          <div className='bg-card min-h-[20vh] w-full rounded-lg border border-gray-300 p-4 shadow-sm'>
                            <div className='py-2'>
                              <p className='text-lg'>
                                Scans aim to provide anayltics and observability for your flows. <br />
                                <a
                                  href='https://flowtest-ai.vercel.app/'
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
                              <input type='checkbox' {...register('enabled')} id='enabled' className='block' />
                              {errors.enabled && <div className='text-red-500'>{errors.enabled.message}</div>}
                            </div>
                            <div className='py-2'>
                              <label htmlFor='accessId' className='block text-lg font-medium text-gray-700'>
                                Access Id
                              </label>
                              <input
                                {...register('accessId')}
                                type='text'
                                placeholder='Access Id'
                                className='mb-2 block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
                              />
                              {errors.accessId && <div className='text-red-500'>{errors.accessId.message}</div>}
                            </div>
                            <div className='py-2'>
                              <label htmlFor='accessKey' className='block text-lg font-medium text-gray-700'>
                                Access Key
                              </label>
                              <input
                                {...register('accessKey')}
                                type='text'
                                placeholder='Access Key'
                                className='mb-2 block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
                              />
                              {errors.accessKey && <div className='text-red-500'>{errors.accessKey.message}</div>}
                            </div>
                            <div>
                              {errors.root && <div className='text-red-500'>{errors.root.message}</div>}{' '}
                              {successFullSubmissionMessage && (
                                <div className='text-green-500'> Successfully saved settings</div>
                              )}
                            </div>
                          </div>
                          <div className='flex justify-center w-full mt-6'>
                            <Button btnType={BUTTON_TYPES.primary} isDisabled={isSubmitting} fullWidth={true}>
                              {isSubmitting ? 'Loading...' : 'Save'}
                            </Button>
                          </div>
                        </form>
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
