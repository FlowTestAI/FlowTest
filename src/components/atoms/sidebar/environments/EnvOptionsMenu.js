import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Transition } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';

// ToDo: Combine this component with OptionsMenu in sidebar atoms to make it generic
const EnvOptionsMenu = ({ pathName, itemType, collectionId }) => {
  const menuItemsStyles =
    'group flex w-full items-center rounded px-2 py-2 text-sm text-gray-900 transition duration-200 ease-out hover:bg-background-light';
  return (
    <Menu
      as='div'
      className='relative inline-block text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
    >
      <Menu.Button data-click-from='env-options-menu' className='p-2' data-item-type={itemType}>
        <EllipsisVerticalIcon
          className='w-4 h-4'
          aria-hidden='true'
          data-click-from='env-options-menu'
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
          className='absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none'
          data-click-from='env-options-menu'
          data-item-type={itemType}
        >
          <div className='px-1 py-1' data-click-from='env-options-menu' data-item-type={itemType}>
            <Menu.Item data-click-from='env-options-menu' data-item-type={itemType}>
              <button
                className={menuItemsStyles}
                data-click-from='env-options-menu'
                data-options-menu-item={DirectoryOptionsActions.addNewEnvironment.value}
                data-path-name={pathName}
                data-collection-id={collectionId}
              >
                <PencilSquareIcon
                  className='w-4 h-4 mr-2'
                  aria-hidden='true'
                  data-click-from='env-options-menu'
                  data-item-type={itemType}
                />
                New Environment
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

EnvOptionsMenu.propTypes = {
  pathName: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
};

export default EnvOptionsMenu;
