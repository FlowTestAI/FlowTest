import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
const authKeys = [{ name: 'Select Auth Key' }, { name: 'No Authorization' }];

const SelectAuthKeys = () => {
  const [selected, setSelected] = useState(authKeys[0]);
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative rounded border border-solid border-[#94a3b8]'>
        <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg cursor-default sm:text-sm'>
          <span className='block truncate'>{selected.name}</span>
          <span className='absolute flex items-center pr-2 pointer-events-none right-2 top-3'>
            <ChevronUpDownIcon className='w-5 h-5 text-gray-400' aria-hidden='true' />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <Listbox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg sm:text-sm max-h-60 ring-1 ring-black/5'>
            {authKeys.map((authKey, authKeyIdx) => (
              <Listbox.Option
                key={authKeyIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={authKey}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{authKey.name}</span>
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
  );
};

export default SelectAuthKeys;
