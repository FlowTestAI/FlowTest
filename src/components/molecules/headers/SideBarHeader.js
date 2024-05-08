import React from 'react';
import { UserIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { AppNavBarItems } from 'constants/AppNavBar';
import useNavigationStore from 'stores/AppNavBarStore';

const SideBarHeader = () => {
  const navigationSelectedValue = useNavigationStore((state) => {
    const navigationVal = state.selectedNavVal;
    switch (navigationVal) {
      case AppNavBarItems.collections.value:
        return AppNavBarItems.collections.displayValue;
      case AppNavBarItems.environments.value:
        return AppNavBarItems.environments.displayValue;
      default:
        return AppNavBarItems.environments.displayValue;
    }
  });
  return (
    <div className='flex justify-between p-2'>
      <div className='flex items-center justify-start gap-1'>
        <a className='flex items-center justify-between gap-1 link-hover link'>
          <UserIcon className='w-3 h-3' />
          <span>My Workspace</span>
        </a>
        <ChevronRightIcon className='w-3 h-3' />
        <a className='link-hover link'>{navigationSelectedValue}</a>
      </div>
    </div>
  );
};

export default SideBarHeader;
