import React, { useState } from 'react';
import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/20/solid';
import NewCollection from 'components/molecules/modals/create/NewCollectionModal';
import ImportCollectionModal from 'components/molecules/modals/ImportCollectionModal';
import OpenCollectionModal from '../modals/OpenCollectionModal';

const SideBarSubHeader = () => {
  //const [newCollectionModalOpen, setNewCollectionModalOpen] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [importCollectionModal, setImportCollectionModal] = useState(false);
  return (
    <>
      <div className='flex items-center border-b border-neutral-300 text-cyan-950'>
        <button
          className='inline-flex items-center justify-center w-full gap-2 p-2 px-4 transition whitespace-nowrap hover:bg-slate-100'
          onClick={() => setOpenCollectionModal(true)}
        >
          <FolderArrowDownIcon className='w-4 h-4' />
          <span className='font-semibold'>Open</span>
        </button>
        <button
          className='inline-flex items-center justify-center w-full gap-2 p-2 px-4 transition border-l-2 whitespace-nowrap border-slate-100 hover:bg-slate-100'
          onClick={() => setImportCollectionModal(true)}
        >
          <PlusIcon className='w-4 h-4' />
          <span className='font-semibold'>Import</span>
        </button>
      </div>
      <div>
        {/* ToDo: These modals will be contextual in term of selected folder or collection */}
        <OpenCollectionModal closeFn={() => setOpenCollectionModal(false)} open={openCollectionModal} />
        <ImportCollectionModal closeFn={() => setImportCollectionModal(false)} open={importCollectionModal} />
      </div>
    </>
  );
};

export default SideBarSubHeader;
