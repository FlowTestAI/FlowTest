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
        <Tippy content='Github' placement='top'>
          <a href='https://github.com/FlowTestAI/FlowTest' target='_blank' rel='noreferrer' className='link'>
            <b>Github</b>
          </a>
        </Tippy>

        <Tippy content='Contact Us' placement='top'>
          <a
            href='https://github.com/FlowTestAI/FlowTest/discussions'
            target='_blank'
            rel='noreferrer'
            className='link'
          >
            <b>Contact us</b>
          </a>
        </Tippy>

        <Tippy content='Discord' placement='top'>
          <a href='https://discord.gg/Pf9tdSjPeF' target='_blank' rel='noreferrer' className='link'>
            <b>Discord</b>
          </a>
        </Tippy>

        <Tippy content='Coming Soon' placement='top'>
          <a href='#' className='link'>
            <b>Docs</b>
          </a>
        </Tippy>

        <Tippy content='About' placement='top'>
          <a href='https://github.com/FlowTestAI/FlowTest' target='_blank' rel='noreferrer' className='link'>
            <b>About</b>
          </a>
        </Tippy>
      </div>
    </footer>
  );
};

export default MainFooter;
