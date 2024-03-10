import React from 'react';
import { Square3Stack3DIcon, RectangleStackIcon, ClockIcon } from '@heroicons/react/20/solid';
import { useNavigationStore } from 'stores/AppNavBarStore';
import { AppNavBarItems } from 'constants/AppNavBar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// ToDo: May be make this section collapsable and only show Icons when collapsed
const AppNavBar = () => {
  const navigationSelectedValue = useNavigationStore((state) => state.selectedNavVal);
  const updateNavigationSelectedValue = useNavigationStore((state) => state.setNavState);

  const handleOnClick = (event) => {
    const dataAttributeValue = event.currentTarget.dataset.navItem;
    updateNavigationSelectedValue(dataAttributeValue);
  };

  return (
    <nav className='relative flex h-screen w-28 flex-col border-r border-neutral-300 text-cyan-950'>
      <button className='relative' onClick={handleOnClick} data-nav-item={AppNavBarItems.collections.value}>
        <div
          className={`${
            navigationSelectedValue === AppNavBarItems.collections.value
              ? 'bg-slate-100 before:absolute before:left-0 before:top-0 before:h-full before:w-[0.25rem] before:bg-cyan-950 before:content-[""]'
              : 'hover:bg-cyan-950 hover:text-white'
          } flex w-full flex-col items-center px-2 py-4 text-center`}
        >
          <RectangleStackIcon className='mb-2 h-4 w-4' />
          <div>{AppNavBarItems.collections.displayValue}</div>
        </div>
      </button>
      <button className='relative' onClick={handleOnClick} data-nav-item={AppNavBarItems.environments.value}>
        <div
          className={`${
            navigationSelectedValue === AppNavBarItems.environments.value
              ? 'bg-slate-100 before:absolute before:left-0 before:top-0 before:h-full before:w-[0.25rem] before:bg-cyan-950 before:content-[""]'
              : 'hover:bg-cyan-950 hover:text-white'
          } flex w-full flex-col items-center px-2 py-4 text-center`}
        >
          <Square3Stack3DIcon className='mb-2 h-4 w-4' />
          <div>{AppNavBarItems.environments.displayValue}</div>
        </div>
      </button>
      <button className='cursor-not-allowed px-2 py-4' data-nav-item={AppNavBarItems.history.value}>
        <Tippy content='Coming Soon!' placement='right'>
          <div className='flex flex-col items-center text-center text-slate-400'>
            <ClockIcon className='mb-2 h-4 w-4' />
            <div>{AppNavBarItems.history.displayValue}</div>
          </div>
        </Tippy>
      </button>
    </nav>
  );
};

export default AppNavBar;
