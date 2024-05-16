import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Transition } from '@headlessui/react';
import { FolderPlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';
import { OBJ_TYPES } from 'constants/Common';

const OptionsMenu = ({ collectionId, directory, itemType }) => {
  const menuItemsStyles =
    'group flex w-full items-center rounded p-2 text-sm transition duration-200 ease-out hover:bg-background-light hover:font-semibold hover:font-cyan-950';
  return (
    <Menu
      as='div'
      className='relative inline-block text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
    >
      <Menu.Button data-click-from='options-menu' className='p-2' data-item-type={itemType}>
        <EllipsisVerticalIcon
          className='w-4 h-4'
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
          className='absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none'
          data-click-from='options-menu'
          data-item-type={itemType}
        >
          {itemType === OBJ_TYPES.collection || itemType === OBJ_TYPES.folder ? (
            <div className='px-1 py-1' data-click-from='options-menu' data-item-type={itemType}>
              <Menu.Item data-click-from='options-menu' data-item-type={itemType}>
                <button
                  className={menuItemsStyles}
                  data-click-from='options-menu'
                  data-options-menu-item={DirectoryOptionsActions.addNewFolder.value}
                  data-path-name={directory.pathname}
                  data-item-type={itemType}
                  data-collection-id={collectionId}
                >
                  <FolderPlusIcon
                    className='w-4 h-4 mr-2'
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
                  data-collection-id={collectionId}
                >
                  <PencilSquareIcon
                    className='w-4 h-4 mr-2'
                    aria-hidden='true'
                    data-click-from='options-menu'
                    data-item-type={itemType}
                  />
                  {DirectoryOptionsActions.addNewFlow.displayValue}
                </button>
              </Menu.Item>
            </div>
          ) : (
            <div className='px-1 py-1' data-click-from='options-menu' data-item-type={itemType}>
              <Menu.Item data-click-from='options-menu' data-item-type={itemType}>
                <button
                  className={menuItemsStyles}
                  data-click-from='options-menu'
                  data-options-menu-item={DirectoryOptionsActions.cloneFlow.value}
                  data-path-name={directory.pathname}
                  data-item-type={itemType}
                  data-collection-id={collectionId}
                >
                  <PencilSquareIcon
                    className='w-4 h-4 mr-2'
                    aria-hidden='true'
                    data-click-from='options-menu'
                    data-item-type={itemType}
                  />
                  {DirectoryOptionsActions.cloneFlow.displayValue}
                </button>
              </Menu.Item>
            </div>
          )}
          <div className='px-1 py-1' data-click-from='options-menu' data-item-type={itemType}>
            <Menu.Item data-click-from='options-menu' data-item-type={itemType}>
              <button
                className={menuItemsStyles}
                data-click-from='options-menu'
                data-options-menu-item={DirectoryOptionsActions.delete.value}
                data-path-name={directory.pathname}
                data-item-type={itemType}
                data-collection-id={collectionId}
              >
                {itemType === OBJ_TYPES.collection ? (
                  <>
                    <XMarkIcon
                      className='w-4 h-4 mr-2'
                      aria-hidden='true'
                      data-click-from='options-menu'
                      data-item-type={itemType}
                    />
                    {DirectoryOptionsActions.remove.displayValue}
                  </>
                ) : (
                  <>
                    <TrashIcon
                      className='w-4 h-4 mr-2'
                      aria-hidden='true'
                      data-click-from='options-menu'
                      data-item-type={itemType}
                    />
                    {DirectoryOptionsActions.delete.displayValue}
                  </>
                )}
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
