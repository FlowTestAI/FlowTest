import React from 'react';
import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ModalNames } from 'constants/ModalNames';

const EmptyDirectory = () => {
  return (
    <div className='tw-flex tw-flex-1 tw-flex-col'>
      <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4'>
        <div className='tw-text-xs tw-font-medium'>Create or Import a collection</div>
        <div className='tw-mt-4 tw-flex tw-flex-col tw-items-stretch tw-gap-4'>
          {/* For future use of this button */}
          {/* <button className='tw-rounded tw-bg-cyan-950 tw-px-4 tw-py-1 tw-text-white'>Open</button> */}
          <button
            className='tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded tw-bg-cyan-950 tw-px-4 tw-py-2 tw-text-white tw-transition'
            data-modal={ModalNames.CREATE_NEW_COLLECTION_MODAL}
          >
            <FolderArrowDownIcon className='tw-h-4 tw-w-4' data-modal={ModalNames.CREATE_NEW_COLLECTION_MODAL} />
            <span className=' tw-font-semibold' data-modal={ModalNames.CREATE_NEW_COLLECTION_MODAL}>
              New
            </span>
          </button>
          <button
            className='tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded tw-bg-cyan-950 tw-px-4 tw-py-2 tw-text-white tw-transition'
            data-modal={ModalNames.IMPORT_COLLECTION_MODAL} // need this at all the nested elements as well as we are using event bubbling to open the related modal
          >
            <PlusIcon className='tw-h-4 tw-w-4' data-modal={ModalNames.IMPORT_COLLECTION_MODAL} />
            <span className=' tw-font-semibold' data-modal={ModalNames.IMPORT_COLLECTION_MODAL}>
              Import
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyDirectory;
