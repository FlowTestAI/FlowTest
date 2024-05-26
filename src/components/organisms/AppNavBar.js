import React from 'react';
import { Square3Stack3DIcon, RectangleStackIcon, ClockIcon } from '@heroicons/react/20/solid';
import useNavigationStore from 'stores/AppNavBarStore';
import { AppNavBarItems, AppNavBarStyles } from 'constants/AppNavBar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Transition } from '@headlessui/react';

// ToDo: May be make this section collapsable and only show Icons when collapsed
const AppNavBar = ({ showRightBorder = true }) => {
  const navigationSelectedValue = useNavigationStore((state) => state.selectedNavVal);
  const updateNavigationSelectedValue = useNavigationStore((state) => state.setNavState);
  const isNavBarCollapsed = useNavigationStore((state) => state.collapseNavBar);

  const handleOnClick = (event) => {
    const dataAttributeValue = event.currentTarget.dataset.navItem;
    updateNavigationSelectedValue(dataAttributeValue);
  };

  const selectedNavItemStyles = 'before:bg-cyan-900 bg-background text-cyan-900';
  const nonSelectedNavItemStyles = 'hover:bg-cyan-900 hover:text-white';
  const navStyles = 'relative flex h-screen flex-col transition-all delay-150 duration-300';
  return (
    <nav
      className={`${navStyles} ${isNavBarCollapsed ? AppNavBarStyles.collapsedNavBarWidth.tailwindValue.min : AppNavBarStyles.expandedNavBarWidth.tailwindValue.min} ${showRightBorder && !isNavBarCollapsed ? 'border-r border-gray-300' : ''}`}
    >
      <button className='relative' onClick={handleOnClick} data-nav-item={AppNavBarItems.collections.value}>
        <div
          className={`text-cyan-900 ${
            navigationSelectedValue === AppNavBarItems.collections.value
              ? `before:absolute before:left-0 before:top-0 before:h-full before:w-[0.25rem] before:content-[""] ${selectedNavItemStyles}`
              : nonSelectedNavItemStyles
          } delay-50 flex w-full flex-col items-center px-2 py-4 text-center transition-all duration-100`}
        >
          {isNavBarCollapsed ? (
            <Tippy content={AppNavBarItems.collections.displayValue} placement='right'>
              <RectangleStackIcon className='mb-2 h-4 w-4' />
            </Tippy>
          ) : (
            <RectangleStackIcon className='mb-2 h-4 w-4' />
          )}
          <Transition
            show={!isNavBarCollapsed}
            enter='transition-all ease-in-out duration-500 delay-[200ms]'
            enterFrom='opacity-0 translate-y-6'
            enterTo='opacity-100 translate-y-0'
            leave='transition-all ease-in-out duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            {AppNavBarItems.collections.displayValue}
          </Transition>
        </div>
      </button>
      <button className='relative' onClick={handleOnClick} data-nav-item={AppNavBarItems.environments.value}>
        <div
          className={`text-cyan-900 ${
            navigationSelectedValue === AppNavBarItems.environments.value
              ? `before:absolute before:left-0 before:top-0 before:h-full before:w-[0.25rem] before:content-[""] ${selectedNavItemStyles}`
              : nonSelectedNavItemStyles
          } delay-50 flex w-full flex-col items-center px-2 py-4 text-center transition-all duration-100`}
        >
          {isNavBarCollapsed ? (
            <Tippy content={AppNavBarItems.environments.displayValue} placement='right'>
              <Square3Stack3DIcon className='mb-2 h-4 w-4' />
            </Tippy>
          ) : (
            <Square3Stack3DIcon className='mb-2 h-4 w-4' />
          )}
          <Transition
            show={!isNavBarCollapsed}
            enter='transition-all ease-in-out duration-500 delay-[200ms]'
            enterFrom='opacity-0 translate-y-6'
            enterTo='opacity-100 translate-y-0'
            leave='transition-all ease-in-out duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            {AppNavBarItems.environments.displayValue}
          </Transition>
        </div>
      </button>
      <button className='cursor-not-allowed px-2 py-4 ' data-nav-item={AppNavBarItems.history.value}>
        <div className='text-gray-300'>
          {isNavBarCollapsed ? (
            <div className='transition-all delay-150 duration-300'>
              <Tippy content={AppNavBarItems.history.displayValue + ': Coming Soon!'} placement='right'>
                <div className='flex flex-col items-center text-center '>
                  <ClockIcon className='mb-2 h-4 w-4' />
                </div>
              </Tippy>
            </div>
          ) : (
            <Tippy content='Coming Soon!' placement='right'>
              <div className='flex flex-col items-center text-center '>
                <ClockIcon className='mb-2 h-4 w-4' />
              </div>
            </Tippy>
          )}
          <Transition
            show={!isNavBarCollapsed}
            enter='transition-all ease-in-out duration-500 delay-[200ms]'
            enterFrom='opacity-0 translate-y-6'
            enterTo='opacity-100 translate-y-0'
            leave='transition-all ease-in-out duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            {AppNavBarItems.history.displayValue}
          </Transition>
        </div>
      </button>
    </nav>
  );
};

export default AppNavBar;
