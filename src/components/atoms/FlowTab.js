import React from 'react';
import { ShareIcon } from '@heroicons/react/20/solid';

const FlowTab = () => {
  return (
    <div className='tw-border-[rgba(128, 128, 128, 0.35)] tw-flex tw-items-center tw-gap-x-2 tw-border-r tw-px-8 tw-py-4'>
      <ShareIcon className='tw-h-5 tw-w-5' />
      New Flow
    </div>
  );
};

export default FlowTab;
