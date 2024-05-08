import React from 'react';
import { ArrowLeftEndOnRectangleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import useNavigationStore from 'stores/AppNavBarStore';

const MainFooter = () => {
  const collapseNavBarValue = useNavigationStore((state) => state.collapseNavBar);
  const updateNavCollapseState = useNavigationStore((state) => state.setNavCollapseState);
  return (
    <footer className='flex items-center justify-between px-6 py-2 text-xs'>
      <label className='py-1 cursor-pointer swap swap-rotate'>
        <input
          type='checkbox'
          onClick={() => {
            updateNavCollapseState(!collapseNavBarValue);
          }}
        />
        <ArrowRightStartOnRectangleIcon className='w-6 h-6 swap-on' />
        <ArrowLeftEndOnRectangleIcon className='w-6 h-6 swap-off' />
      </label>
      <div className='flex items-center justify-between gap-4 font-semibold'>
        <Tippy content='External Link' placement='top'>
          <a href='https://github.com/FlowTestAI/FlowTest' target='_blank' rel='noreferrer' className='link'>
            Github
          </a>
        </Tippy>

        <Tippy content='External Link' placement='top'>
          <a
            href='https://github.com/FlowTestAI/FlowTest/discussions'
            target='_blank'
            rel='noreferrer'
            className='link'
          >
            Contact us
          </a>
        </Tippy>

        <Tippy content='External Link' placement='top'>
          <a href='https://discord.gg/Pf9tdSjPeF' target='_blank' rel='noreferrer' className='link'>
            Discord
          </a>
        </Tippy>

        <Tippy content='Coming Soon' placement='top'>
          <a href='#' className='link'>
            Docs
          </a>
        </Tippy>

        <Tippy content='External Link' placement='top'>
          <a href='https://github.com/FlowTestAI/FlowTest' target='_blank' rel='noreferrer' className='link'>
            About
          </a>
        </Tippy>
      </div>
    </footer>
  );
};

export default MainFooter;
