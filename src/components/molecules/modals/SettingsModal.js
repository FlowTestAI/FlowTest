import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';

const schema = z.object({
  accessId: z.string().min(5),
  accessKey: z.string().min(5),
});
//
// type FormFields = z.infer<typeof schema>;

const SettingsModal = ({ closeFn = () => null, open = false }) => {
  const [successFullSubmissionMessage, showSuccessFullSubmissionMessage] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      accessId: '',
    },
    resolver: zodResolver(schema),
  });

  const onFormSubmit = async (data) => {
    console.log(`\n \n onFormSubmit = ${data}\n \n`);
    try {
      console.log(data);
      // send the from data as a request
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
                <Dialog.Panel className='w-full max-w-5xl transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title as='h1' className='border-b border-gray-300 pb-4 text-center text-3xl font-semibold'>
                    Settings
                  </Dialog.Title>
                  <div className='p-4'>
                    <form className='flex flex-col items-center gap-4'>
                      <div className='bg-card min-h-[20vh] w-full rounded-lg border border-gray-300 p-4 shadow-sm'>
                        <div className='py-2'>
                          <h2 className='text-2xl font-semibold'>Access Id and Keys</h2>
                          <p className='mt-2 text-lg'>
                            To generate your access key pair for CLI Login:{' '}
                            <a href='' target='_blank' rel='noreferrer' className='link'>
                              Link
                            </a>
                          </p>
                        </div>
                        <div className='py-4'>
                          <div className='py-2'>
                            <input
                              {...register('accessId')}
                              type='text'
                              placeholder='Access Id'
                              className='mb-2 block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
                            />
                            {errors.accessId && <div className='text-red-500'>{errors.accessId.message}</div>}
                          </div>
                          <div className='py-2'>
                            <input
                              {...register('accessKey')}
                              type='text'
                              placeholder='Access Key'
                              className='mb-2 block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
                            />
                            {errors.accessKey && <div className='text-red-500'>{errors.accessKey.message}</div>}
                          </div>
                        </div>
                        <div>
                          {errors.root && <div className='text-red-500'>{errors.root.message}</div>}{' '}
                          {successFullSubmissionMessage && (
                            <div className='text-green-500'> Successfully submitted the form data</div>
                          )}
                        </div>
                      </div>

                      <div className='mt-6 flex w-full items-center gap-2'>
                        <Button
                          btnType={BUTTON_TYPES.secondary}
                          intentType={BUTTON_INTENT_TYPES.error}
                          isDisabled={false}
                          onClickHandle={(event) => {
                            event.preventDefault();
                            closeFn();
                          }}
                          fullWidth={true}
                        >
                          Cancel
                        </Button>
                        <Button
                          btnType={BUTTON_TYPES.primary}
                          isDisabled={isSubmitting}
                          onClickHandle={handleSubmit(onFormSubmit)}
                          fullWidth={true}
                        >
                          {isSubmitting ? 'Loading...' : 'Update'}
                        </Button>
                      </div>
                    </form>
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
