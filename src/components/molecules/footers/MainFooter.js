import React from 'react';
import { ArrowLeftEndOnRectangleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import useNavigationStore from 'stores/AppNavBarStore';

const MainFooter = () => {
  const collapseNavBarValue = useNavigationStore((state) => state.collapseNavBar);
  const updateNavCollapseState = useNavigationStore((state) => state.setNavCollapseState);
  return (
    <footer className='flex items-center justify-between px-6 py-2 text-xs border-t border-neutral-300'>
      <label className='py-1 cursor-pointer swap swap-rotate'>
        <input
          type='checkbox'
          onClick={() => {
            console.log('I have been clicked');
            updateNavCollapseState(!collapseNavBarValue);
          }}
        />
        <ArrowRightStartOnRectangleIcon className='w-6 h-6 swap-on' />
        <ArrowLeftEndOnRectangleIcon className='w-6 h-6 swap-off' />
      </label>
      <div className='flex items-center justify-between gap-4'>
        <Tippy content='External link: github.com' placement='top'>
          <a href='#' target='_blank' className='link' rel='noreferrer'>
            Github
          </a>
        </Tippy>

        <Tippy content='External link: github discussions' placement='top'>
          <a href='#' className='link'>
            Contact us
          </a>
        </Tippy>

        <Tippy content='External link' placement='top'>
          <a href='#' className='link'>
            Discord
          </a>
        </Tippy>

        <Tippy content='Coming Soon' placement='top'>
          <a href='#' className='link'>
            Docs
          </a>
        </Tippy>

        <Tippy content='External link: github repo' placement='top'>
          <a href='https://github.com/FlowTestAI/FlowTest' className='link'>
            About
          </a>
        </Tippy>
      </div>
    </footer>
  );
};

export default MainFooter;
