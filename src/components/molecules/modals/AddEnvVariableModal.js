import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import useEnvStore from 'stores/EnvStore';
import { toast } from 'react-toastify';
import TextInput from 'components/atoms/common/TextInput';

const AddEnvVariableModal = ({ closeFn = () => null, open = false, handleAddVariable }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const [showKeyError, setShowKeyError] = useState(false);
  const [showValueError, setShowValueError] = useState(false);

  const resetFields = () => {
    setKey('');
    setValue('');
    setShowKeyError(false);
    setShowValueError(false);
  };

  return (
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
                  Add Variable
                </Dialog.Title>
                <div className='mt-6'>
                  <div className='mt-4'>
                    <TextInput
                      id='key'
                      placeHolder={`Key`}
                      onChangeHandler={(event) => setKey(event.target.value)}
                      name={'Key'}
                      value={key}
                    />
                    {showKeyError ? <div className='py-2 text-red-600'>Please provide a key</div> : ''}
                  </div>
                  <div className='mt-4'>
                    <TextInput
                      id='value'
                      placeHolder={`Value`}
                      onChangeHandler={(event) => setValue(event.target.value)}
                      name={'Value'}
                      value={value}
                    />
                    {showValueError ? <div className='py-2 text-red-600'>Please provide a key</div> : ''}
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
                    btnType={BUTTON_TYPES.secondary}
                    isDisabled={false}
                    fullWidth={true}
                    onClickHandle={() => {
                      if (!key || key === '') {
                        setShowKeyError(true);
                        return;
                      }
                      if (!value || value === '') {
                        setShowValueError(true);
                        return;
                      }
                      const variables = useEnvStore.getState().variables;
                      if (key.trim() === '') {
                        toast.error('Variable name cannot be empty.');
                      } else if (variables[key] != undefined) {
                        toast.error('A variable with the same name already exists.');
                      } else {
                        handleAddVariable(key, value);
                        //reset
                        setKey('');
                        setValue('');
                      }
                      resetFields();
                      closeFn();
                    }}
                  >
                    Add
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

AddEnvVariableModal.propTypes = {
  closeFn: PropTypes.func.isRequired,
  open: PropTypes.boolean.isRequired,
};

export default AddEnvVariableModal;
