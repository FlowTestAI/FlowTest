import React from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import FlowTab from '../../atoms/FlowTab';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const WorkspaceHeader = () => {
  return (
    <div className='tw-border-[rgba(128, 128, 128, 0.35)] tw-flex tw-gap-3 tw-border-b'>
      <FlowTab />
      <button className='tw-cursor-not-allowed'>
        <Tippy content='Coming Soon!' placement='right'>
          <PlusIcon className='tw-h-5 tw-w-5' />
        </Tippy>
      </button>
    </div>
  );
};

export default WorkspaceHeader;
