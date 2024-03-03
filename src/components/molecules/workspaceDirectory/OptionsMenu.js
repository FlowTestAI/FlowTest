import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisVerticalIcon, FolderPlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';

const OptionsMenu = () => {
  return (
    <Menu as='div' className='tw-relative tw-inline-block tw-text-left'>
      <Menu.Button data-click-from='options-menu' className='tw-p-2'>
        <EllipsisVerticalIcon className='tw-h-4 tw-w-4' aria-hidden='true' data-click-from='options-menu' />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='tw-transition tw-ease-out tw-duration-100'
        enterFrom='tw-transform tw-opacity-0 tw-scale-95'
        enterTo='tw-transform tw-opacity-100 tw-scale-100'
        leave='tw-transition tw-ease-in tw-duration-75'
        leaveFrom='tw-transform tw-opacity-100 tw-scale-100'
        leaveTo='tw-transform tw-opacity-0 tw-scale-95'
      >
        <Menu.Items
          className='tw-focus:outline-none tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-divide-y tw-divide-gray-100 tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black/5'
          data-click-from='options-menu'
        >
          <div className='tw-px-1 tw-py-1' data-click-from='options-menu'>
            <Menu.Item data-click-from='options-menu'>
              <button
                className='tw-group tw-flex tw-w-full tw-items-center tw-rounded-md tw-px-2 tw-py-2 tw-text-sm tw-text-gray-900'
                data-click-from='options-menu'
              >
                <FolderPlusIcon className='tw-mr-2 tw-h-4 tw-w-4' aria-hidden='true' data-click-from='options-menu' />
                New Folder
              </button>
            </Menu.Item>
            <Menu.Item data-click-from='options-menu'>
              <button
                className='tw-group tw-flex tw-w-full tw-items-center tw-rounded-md tw-px-2 tw-py-2 tw-text-sm tw-text-gray-900'
                data-click-from='options-menu'
              >
                <PencilSquareIcon className='tw-mr-2 tw-h-4 tw-w-4' aria-hidden='true' data-click-from='options-menu' />
                New Flow test
              </button>
            </Menu.Item>
          </div>
          <div className='tw-px-1 tw-py-1' data-click-from='options-menu'>
            <Menu.Item data-click-from='options-menu'>
              <button
                className='tw-group tw-flex tw-w-full tw-items-center tw-rounded-md tw-px-2 tw-py-2 tw-text-sm tw-text-gray-900'
                data-click-from='options-menu'
              >
                <TrashIcon className='tw-mr-2 tw-h-4 tw-w-4' aria-hidden='true' data-click-from='options-menu' />
                Delete
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default OptionsMenu;
