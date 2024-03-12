import React from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FolderPlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';

const OptionsMenu = ({ directory, itemType }) => {
  const menuItemsStyles =
    'group flex w-full items-center rounded px-2 py-2 text-sm text-gray-900 transition duration-200 ease-out hover:bg-slate-100';
  return (
    <Menu
      as='div'
      className='relative inline-block rounded rounded-l-none text-left transition duration-200 ease-out hover:bg-slate-200'
    >
      <Menu.Button data-click-from='options-menu' className='p-2' data-item-type={itemType}>
        <EllipsisVerticalIcon
          className='h-4 w-4'
          aria-hidden='true'
          data-click-from='options-menu'
          data-item-type={itemType}
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
          data-click-from='options-menu'
          data-item-type={itemType}
        >
          <div className='px-1 py-1' data-click-from='options-menu' data-item-type={itemType}>
            <Menu.Item data-click-from='options-menu' data-item-type={itemType}>
              <button
                className={menuItemsStyles}
                data-click-from='options-menu'
                data-options-menu-item={DirectoryOptionsActions.addNewFolder.value}
                data-path-name={directory.pathname}
                data-item-type={itemType}
              >
                <FolderPlusIcon
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  data-click-from='options-menu'
                  data-item-type={itemType}
                />
                {DirectoryOptionsActions.addNewFolder.displayValue}
              </button>
            </Menu.Item>
            <Menu.Item data-click-from='options-menu' data-item-type={itemType}>
              <button
                className={menuItemsStyles}
                data-click-from='options-menu'
                data-options-menu-item={DirectoryOptionsActions.addNewFlow.value}
                data-path-name={directory.pathname}
                data-item-type={itemType}
              >
                <PencilSquareIcon
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  data-click-from='options-menu'
                  data-item-type={itemType}
                />
                {DirectoryOptionsActions.addNewFlow.displayValue}
              </button>
            </Menu.Item>
          </div>
          <div className='px-1 py-1' data-click-from='options-menu' data-item-type={itemType}>
            <Menu.Item data-click-from='options-menu' data-item-type={itemType}>
              <button
                className={menuItemsStyles}
                data-click-from='options-menu'
                data-options-menu-item={DirectoryOptionsActions.delete.value}
                data-path-name={directory.pathname}
                data-item-type={itemType}
              >
                <TrashIcon
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  data-click-from='options-menu'
                  data-item-type={itemType}
                />
                {DirectoryOptionsActions.delete.displayValue}
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

OptionsMenu.propTypes = {
  directory: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
};

export default OptionsMenu;
