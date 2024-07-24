import React, { useState, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import TextInput from 'components/atoms/common/TextInput';
import { TextEditor } from 'components/atoms/common/TextEditor';
import useCollectionStore from 'stores/CollectionStore';
import { useTabStore } from 'stores/TabStore';
import { cloneDeep } from 'lodash';

const AuthNode = ({ id, data }) => {
  const setAuthNodeType = useCanvasStore((state) => state.setAuthNodeType);
  const setBasicAuthValues = useCanvasStore((state) => state.setBasicAuthValues);
  const setBearerTokenValue = useCanvasStore((state) => state.setBearerTokenValue);
  const [selected, setSelected] = useState(data.type ? data.type : 'no-auth');

  const handleBasicAuthValueChange = (value, option) => {
    setBasicAuthValues(id, option, value);
  };

  const handleBearerTokenChange = (value) => {
    setBearerTokenValue(id, value);
  };

  const getActiveVariables = () => {
    const collectionId = useCanvasStore.getState().collectionId;
    if (collectionId) {
      const activeEnv = useCollectionStore
        .getState()
        .collections.find((c) => c.id === collectionId)
        ?.environments.find((e) => e.name === useTabStore.getState().selectedEnv);
      if (activeEnv) {
        return Object.keys(cloneDeep(activeEnv.variables));
      }
    }
    return [];
  };

  const getAuthType = () => {
    if (selected === 'no-auth') {
      return 'No Auth';
    } else if (selected === 'basic-auth') {
      return 'Basic Auth';
    } else if (selected === 'bearer-token') {
      return 'Bearer Token';
    }
  };

  return (
    <>
      <FlowNode
        title='Authentication'
        handleLeft={true}
        handleLeftData={{ type: 'target' }}
        handleRight={true}
        handleRightData={{ type: 'source' }}
      >
        <div className='w-52'>
          <Listbox
            value={selected}
            onChange={(selectedValue) => {
              setSelected(selectedValue);
              setAuthNodeType(id, selectedValue);
            }}
          >
            <div className='relative'>
              <Listbox.Button className='relative w-full cursor-default rounded border border-cyan-950 p-2 text-left'>
                <span className='block truncate'>{getAuthType()}</span>
                <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                  <ChevronUpDownIcon className='h-5 w-5' aria-hidden='true' />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base focus:outline-none'>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 hover:font-semibold ${
                        active ? 'bg-background-light text-slate-900' : ''
                      }`
                    }
                    value={'no-auth'}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block`}>No Auth</span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 font-semibold'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 hover:font-semibold ${
                        active ? 'bg-background-light text-slate-900' : ''
                      }`
                    }
                    value={'basic-auth'}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block`}>Basic auth</span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 font-semibold'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 hover:font-semibold ${
                        active ? 'bg-background-light text-slate-900' : ''
                      }`
                    }
                    value={'bearer-token'}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block`}>Bearer Token</span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 font-semibold'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          {data.type === 'basic-auth' && (
            <div className='flex flex-col gap-2 py-4'>
              <TextEditor
                placeHolder={`Username`}
                onChangeHandler={(value) => handleBasicAuthValueChange(value, 'username')}
                name={'username'}
                value={data.username ? data.username : ''}
                completionOptions={getActiveVariables()}
                styles={'w-full'}
              />
              <TextEditor
                placeHolder={`Password`}
                onChangeHandler={(value) => handleBasicAuthValueChange(value, 'password')}
                name={'password'}
                value={data.password ? data.password : ''}
                completionOptions={getActiveVariables()}
                styles={'w-full'}
              />
            </div>
          )}
          {data.type === 'bearer-token' && (
            <div className='flex flex-col gap-2 py-4'>
              <TextEditor
                placeHolder={`Token`}
                onChangeHandler={(value) => handleBearerTokenChange(value)}
                name={'token'}
                value={data.token ? data.token : ''}
                completionOptions={getActiveVariables()}
                styles={'w-full'}
              />
            </div>
          )}
        </div>
      </FlowNode>
    </>
  );
};

AuthNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AuthNode;
