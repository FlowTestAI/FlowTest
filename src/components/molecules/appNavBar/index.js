import React from 'react';
import { Square3Stack3DIcon, RectangleStackIcon, ClockIcon } from '@heroicons/react/20/solid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useNavigationStore } from 'stores/AppNavBarStore';
import { AppNavBarItems } from 'constants/AppNavBar';

// ToDo: May be make this section collapsable and only show Icons when collapsed
const AppNavBar = () => {
  const navigationSelectedValue = useNavigationStore((state) => state.selectedNavVal);
  const updateNavigationSelectedValue = useNavigationStore((state) => state.setNavState);

  const handleOnClick = (event) => {
    const dataAttributeValue = event.currentTarget.dataset.navItem;
    updateNavigationSelectedValue(dataAttributeValue);
  };

  return (
    <nav className='tw-border-[rgba(128, 128, 128, 0.35)] tw-flex tw-h-screen tw-w-28 tw-flex-col tw-border-r tw-text-cyan-950'>
      {/*
       *  ToDo: Fix for on hover border is taking extra width which is causing few pixel for text and icon shift
       *  Applicable for all the buttons
       */}
      <button
        className={`${
          navigationSelectedValue === AppNavBarItems.collections.value
            ? 'tw-flex tw-flex-col tw-items-center tw-border-l-4 tw-border-cyan-950 tw-bg-slate-100 tw-px-2 tw-py-4 tw-text-center'
            : 'tw-flex tw-flex-col tw-items-center tw-px-2 tw-py-4 tw-text-center hover:tw-bg-cyan-950 hover:tw-text-white'
        }`}
        onClick={handleOnClick}
        data-nav-item={AppNavBarItems.collections.value}
      >
        <RectangleStackIcon className='tw-mb-2 tw-h-4 tw-w-4' />
        <div>{AppNavBarItems.collections.displayValue}</div>
      </button>
      <button
        className={`${
          navigationSelectedValue === AppNavBarItems.environments.value
            ? 'tw-flex tw-flex-col tw-items-center tw-border-l-4 tw-border-cyan-950 tw-bg-slate-100 tw-px-2 tw-py-4 tw-text-center'
            : 'tw-flex tw-flex-col tw-items-center tw-px-2 tw-py-4 tw-text-center hover:tw-bg-cyan-950 hover:tw-text-white'
        }`}
        onClick={handleOnClick}
        data-nav-item={AppNavBarItems.environments.value}
      >
        <Square3Stack3DIcon className='tw-mb-2 tw-h-4 tw-w-4' />
        <div>{AppNavBarItems.environments.displayValue}</div>
      </button>
      <button
        className={`${
          navigationSelectedValue === AppNavBarItems.history.value
            ? 'tw-flex tw-flex-col tw-items-center tw-border-l-4 tw-border-cyan-950 tw-bg-slate-100 tw-px-2 tw-py-4 tw-text-center'
            : 'tw-cursor-not-allowed tw-px-2 tw-py-4 hover:tw-bg-slate-100'
        }`}
        data-nav-item={AppNavBarItems.history.value}
      >
        <Tippy content='Coming Soon!' placement='right'>
          <div className='tw-flex tw-flex-col tw-items-center tw-text-center tw-text-slate-400'>
            <ClockIcon className='tw-mb-2 tw-h-4 tw-w-4' />
            <div>{AppNavBarItems.history.displayValue}</div>
          </div>
        </Tippy>
      </button>
    </nav>
  );
};

export default AppNavBar;
