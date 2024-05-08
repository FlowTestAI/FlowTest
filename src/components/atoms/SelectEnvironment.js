import React, { Fragment, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { useTabStore } from 'stores/TabStore';

const SelectEnvironment = ({ environments }) => {
  const setEnv = useTabStore((state) => state.setSelectedEnv);

  const [selected, setSelected] = useState(null);
  if (selected) {
    setEnv(selected);
  }

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative flex h-full pl-4 border-l border-gray-300'>
        <Listbox.Button
          className={`flex items-center justify-between gap-2 sm:text-sm ${environments.length ? 'cursor-default' : 'cursor-not-allowed'}`}
        >
          <Square3Stack3DIcon className='w-4 h-4' />
          <div className='min-w-32'>{selected ? selected : 'Select environment'}</div>
          <ChevronUpDownIcon className='w-5 h-5' aria-hidden='true' />
        </Listbox.Button>
        {environments.length ? (
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded shadow-lg top-12 max-h-60 ring-1 ring-black/5 sm:text-sm'>
              {environments.map((environment, environmentIndex) => (
                <Listbox.Option
                  key={environmentIndex}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 hover:font-semibold ${
                      active ? 'bg-background-light text-slate-900' : ''
                    }`
                  }
                  value={environment.name}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate`}>{environment.name}</span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 font-semibold'>
                          <CheckIcon className='w-5 h-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        ) : (
          ''
        )}
      </div>
    </Listbox>
  );
};

SelectEnvironment.propTypes = {
  environments: PropTypes.Array.isRequired,
};

export default SelectEnvironment;
