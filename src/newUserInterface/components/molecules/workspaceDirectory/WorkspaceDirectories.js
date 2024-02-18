import React from 'react';
import { FolderArrowDownIcon, FolderPlusIcon } from '@heroicons/react/24/outline';

const WorkspaceDirectories = () => {
  return (
    // Do not Remove, this is for future reference
    // <ul className='tw-px-2 tw-py-4'>
    //   <li className='tw-flex tw-justify-between tw-items-center'>
    //     <div className='tw-flex tw-justify-between tw-items-center tw-gap-x-2'>
    //       <button>
    //         <MdArrowForwardIos />
    //       </button>
    //       <span>Folder 1 </span>
    //     </div>
    //     <WorkspaceDirectoryItems />
    //   </li>
    // </ul>
    // <div className='tw-flex tw-justify-between tw-gap-x-2'>
    <div className='tw-flex tw-flex-1 tw-flex-col'>
      <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4'>
        <div className='tw-text-xs tw-font-medium'>Create or Import a collection</div>
        <div className='tw-mt-4 tw-flex tw-flex-col tw-items-stretch tw-gap-4'>
          {/* For future use of this button */}
          {/* <button className='tw-rounded tw-bg-cyan-950 tw-px-4 tw-py-1 tw-text-white'>Open</button> */}
          <button className='tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded tw-bg-cyan-950 tw-px-4 tw-py-2 tw-text-white tw-transition'>
            <FolderArrowDownIcon className='tw-h-4 tw-w-4' />
            <span className=' tw-font-semibold'>New</span>
          </button>
          <button className='tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded tw-bg-cyan-950 tw-px-4 tw-py-2 tw-text-white tw-transition'>
            <FolderPlusIcon className='tw-h-4 tw-w-4' />

            <span className=' tw-font-semibold'>Import</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDirectories;
