import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';

// const environments = [
//   {
//     id: 'feebd601-63c5-4a4f-8def-1dde4f317567',
//     createdAt: 1710096201431,
//     modifiedAt: 1710096201431,
//     name: 'test.env',
//     pathname:
//       '/Users/sirachit/Desktop/Personal Devo/FlowTest/test/folder-test/Simple API overview/environments/test.env',
//     variables: { k1: 'v1', k2: 'v2', k3: 'v3' },
//   },
//   {
//     id: 'feebd601-63c5-4a4f-8def-1dde4f317567',
//     createdAt: 1710096202431,
//     modifiedAt: 1710096202431,
//     name: 'test2.env',
//     pathname:
//       '/Users/sirachit/Desktop/Personal Devo/FlowTest/test/folder-test/Simple API overview/environments/test2.env',
//     variables: { k1: 'v1', k2: 'v2', k3: 'v3' },
//   },
// ];

const SelectEnvironment = ({ environments }) => {
  const [selected, setSelected] = useState(null);
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative flex h-full pl-4 border-l border-neutral-300'>
        <Listbox.Button className='flex items-center justify-between gap-4 cursor-default sm:text-sm'>
          <Square3Stack3DIcon className='w-4 h-4' />
          <div className='min-w-32'>{selected ? selected : 'Select environment'}</div>
          <ChevronUpDownIcon className='w-5 h-5' aria-hidden='true' />
        </Listbox.Button>
        <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <Listbox.Options className='absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded shadow-lg top-12 max-h-60 ring-1 ring-black/5 sm:text-sm'>
            {environments.map((environment, environmentIndex) => (
              <Listbox.Option
                key={environmentIndex}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={environment.name}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {environment.name}
                    </span>
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

export default SelectEnvironment;
