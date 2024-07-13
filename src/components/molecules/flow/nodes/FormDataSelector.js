import React, { useState, Fragment } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, PlusIcon } from '@heroicons/react/20/solid';

export const optionsData = [
  { value: 'text', label: 'Text' },
  { value: 'file', label: 'File' },
];

const FormDataSelector = ({ onSelectHandler = () => null }) => {
  const [selected, setSelected] = useState(null);

  const getSelectedLabel = (selectedValue) => {
    let labelToShow = '';
    optionsData.forEach((element) => {
      if (element.value === selectedValue) {
        labelToShow = element.label;
      }
    });
    return labelToShow;
  };

  return (
    <>
      <Listbox
        name='param-selector'
        value={selected}
        onChange={(selectedValue) => {
          setSelected(getSelectedLabel(selectedValue));
          onSelectHandler(selectedValue);
        }}
      >
        <div className='relative flex h-full'>
          <Listbox.Button
            className={`flex items-center justify-between gap-1 sm:text-sm ${optionsData.length ? 'cursor-default' : 'cursor-not-allowed'}`}
          >
            <PlusIcon className='w-4 h-4' />
          </Listbox.Button>
          {optionsData.length ? (
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute right-0 z-10 w-full overflow-auto text-base bg-white rounded shadow-lg top-11 max-h-60 min-w-24 ring-1 ring-black/5 sm:text-sm'>
                {optionsData.map((optionData, optionDataIndex) => (
                  <Listbox.Option
                    key={optionDataIndex}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 hover:font-semibold ${
                        active ? 'bg-background-light text-slate-900' : ''
                      }`
                    }
                    value={optionData.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate`}>{optionData.label}</span>
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
    </>
  );
};

export default FormDataSelector;
