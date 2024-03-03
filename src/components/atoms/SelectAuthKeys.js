import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
const authKeys = [{ name: 'Select Auth Key' }, { name: 'No Authorization' }];

const SelectAuthKeys = () => {
  const [selected, setSelected] = useState(authKeys[0]);
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='tw-relative tw-rounded tw-border tw-border-solid tw-border-[#94a3b8]'>
        <Listbox.Button className='tw-sm:text-sm tw-relative tw-w-full tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left'>
          <span className='tw-block tw-truncate'>{selected.name}</span>
          <span className='flex tw-pointer-events-none tw-absolute tw-right-2 tw-top-3 tw-items-center tw-pr-2'>
            <ChevronUpDownIcon className='tw-h-5 tw-w-5 tw-text-gray-400' aria-hidden='true' />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='tw-transition tw-ease-in tw-duration-100'
          leaveFrom='tw-opacity-100'
          leaveTo='tw-opacity-0'
        >
          <Listbox.Options className='tw-sm:text-sm z-10 tw-absolute tw-z-10 tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black/5'>
            {authKeys.map((authKey, authKeyIdx) => (
              <Listbox.Option
                key={authKeyIdx}
                className={({ active }) =>
                  `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                    active ? 'tw-bg-amber-100 tw-text-amber-900' : 'tw-text-gray-900'
                  }`
                }
                value={authKey}
              >
                {({ selected }) => (
                  <>
                    <span className={`tw-block tw-truncate ${selected ? 'tw-font-medium' : 'tw-font-normal'}`}>
                      {authKey.name}
                    </span>
                    {selected ? (
                      <span className='tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 tw-text-amber-600'>
                        <CheckIcon className='tw-h-5 tw-w-5' aria-hidden='true' />
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
