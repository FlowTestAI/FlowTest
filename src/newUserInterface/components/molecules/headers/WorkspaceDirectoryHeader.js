import React from 'react';
import { UserIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { useNavigationStore } from 'newUserInterface/stores/AppNavBarStore';
import { AppNavBarItems } from 'newUserInterface/constants/AppNavBar';

const WorkspaceDirectoryHeader = () => {
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
    <div className='tw-border-[rgba(128, 128, 128, 0.35)] tw-flex tw-justify-between tw-border-b tw-p-2 tw-text-cyan-950'>
      <div className='tw-flex tw-items-center tw-gap-x-1'>
        <UserIcon className='tw-h-3 tw-w-3' />
        <div className='tw-flex tw-items-center tw-justify-start tw-gap-x-1'>
          {/* Here breadcrumbs will only have three values
           * My workspace > [ Navigation selected value ] > [ name of the collection created by the user ]
           */}
          My Workspace <ChevronRightIcon className='tw-h-3 tw-w-3' /> {navigationSelectedValue}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDirectoryHeader;
