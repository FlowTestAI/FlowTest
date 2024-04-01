import React from 'react';
import { Square3Stack3DIcon, RectangleStackIcon, ClockIcon } from '@heroicons/react/20/solid';
import useNavigationStore from 'stores/AppNavBarStore';
import { AppNavBarItems } from 'constants/AppNavBar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Transition } from '@headlessui/react';

// ToDo: May be make this section collapsable and only show Icons when collapsed
const AppNavBar = () => {
  const navigationSelectedValue = useNavigationStore((state) => state.selectedNavVal);
  const updateNavigationSelectedValue = useNavigationStore((state) => state.setNavState);
  const collapseNavBarValue = useNavigationStore((state) => state.collapseNavBar);

  const handleOnClick = (event) => {
    const dataAttributeValue = event.currentTarget.dataset.navItem;
    updateNavigationSelectedValue(dataAttributeValue);
  };

  return (
    <nav
      className={`relative flex h-screen ${collapseNavBarValue ? 'w-14' : 'w-28'} flex-col border-r border-neutral-300 text-cyan-950 transition-all delay-150 duration-300`}
    >
      <button className='relative' onClick={handleOnClick} data-nav-item={AppNavBarItems.collections.value}>
        <div
          className={`${
            navigationSelectedValue === AppNavBarItems.collections.value
              ? 'bg-slate-100 before:absolute before:left-0 before:top-0 before:h-full before:w-[0.25rem] before:bg-cyan-950 before:content-[""]'
              : 'hover:bg-cyan-950 hover:text-white'
          } flex w-full flex-col items-center px-2 py-4 text-center transition-all delay-150 duration-300`}
        >
          {collapseNavBarValue ? (
            <Tippy content={AppNavBarItems.collections.displayValue} placement='right'>
              <RectangleStackIcon className='w-4 h-4 mb-2' />
            </Tippy>
          ) : (
            <RectangleStackIcon className='w-4 h-4 mb-2' />
          )}
          <Transition
            show={!collapseNavBarValue}
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
          className={`${
            navigationSelectedValue === AppNavBarItems.environments.value
              ? 'bg-slate-100 before:absolute before:left-0 before:top-0 before:h-full before:w-[0.25rem] before:bg-cyan-950 before:content-[""]'
              : 'hover:bg-cyan-950 hover:text-white'
          } flex w-full flex-col items-center px-2 py-4 text-center transition-all delay-150 duration-300`}
        >
          {collapseNavBarValue ? (
            <Tippy content={AppNavBarItems.environments.displayValue} placement='right'>
              <Square3Stack3DIcon className='w-4 h-4 mb-2' />
            </Tippy>
          ) : (
            <Square3Stack3DIcon className='w-4 h-4 mb-2' />
          )}
          <Transition
            show={!collapseNavBarValue}
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
      <button className='px-2 py-4 cursor-not-allowed' data-nav-item={AppNavBarItems.history.value}>
        {collapseNavBarValue ? (
          <div className='transition-all duration-300 delay-150'>
            <Tippy content={AppNavBarItems.history.displayValue + ': Coming Soon!'} placement='right'>
              <div className='flex flex-col items-center text-center text-slate-400'>
                <ClockIcon className='w-4 h-4 mb-2' />
              </div>
            </Tippy>
          </div>
        ) : (
          <Tippy content='Coming Soon!' placement='right'>
            <div className='flex flex-col items-center text-center text-slate-400'>
              <ClockIcon className='w-4 h-4 mb-2' />
            </div>
          </Tippy>
        )}
        <Transition
          show={!collapseNavBarValue}
          enter='transition-all ease-in-out duration-500 delay-[200ms]'
          enterFrom='opacity-0 translate-y-6'
          enterTo='opacity-100 translate-y-0'
          leave='transition-all ease-in-out duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          {AppNavBarItems.history.displayValue}
        </Transition>
      </button>
    </nav>
  );
};

export default AppNavBar;
