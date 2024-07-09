import React, { useState } from 'react';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

import Tippy from '@tippyjs/react';
import useNavigationStore from 'stores/AppNavBarStore';
import useCollectionStore from 'stores/CollectionStore';
import SettingsModal from '../modals/SettingsModal';

const MainFooter = () => {
  const collections = useCollectionStore((state) => state.collections);
  const isNavBarCollapsed = useNavigationStore((state) => state.collapseNavBar);
  const updateNavCollapseState = useNavigationStore((state) => state.setNavCollapseState);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  return (
    <footer className='flex items-center justify-between px-4 py-3 text-xs'>
      <div className='flex items-center justify-between gap-2'>
        <button onClick={() => setOpenSettingsModal(true)}>
          <Cog8ToothIcon className='w-6 h-6' />
        </button>
        <label className='py-1 cursor-pointer swap swap-rotate'>
          <input
            // Overriding styles as Daisy UI input and React Hook form's input were conflicting
            className='!focus:outline-none !focus:ring-0 !appearance-none !border-0 !bg-transparent !bg-none !outline-none'
            type='checkbox'
            onClick={(event) => {
              if (collections.length) {
                // since default is false for isNavBarCollapsed
                updateNavCollapseState(!isNavBarCollapsed);
              } else {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          />
          <ArrowRightStartOnRectangleIcon className='w-6 h-6 swap-on' />
          <ArrowLeftEndOnRectangleIcon className='w-6 h-6 swap-off' />
        </label>
      </div>
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
      <SettingsModal closeFn={() => setOpenSettingsModal(false)} open={openSettingsModal} />
    </footer>
  );
};

export default MainFooter;
