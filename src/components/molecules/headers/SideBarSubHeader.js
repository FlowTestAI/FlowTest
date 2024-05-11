import React, { useState } from 'react';
import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/20/solid';
import ImportCollectionModal from 'components/molecules/modals/ImportCollectionModal';
import OpenCollectionModal from '../modals/OpenCollectionModal';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';

const SideBarSubHeader = () => {
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [importCollectionModal, setImportCollectionModal] = useState(false);
  return (
    <>
      <div className='flex items-center flex-1'>
        <Button
          btnType={BUTTON_TYPES.tertiary}
          classes={'rounded-none'}
          isDisabled={false}
          onClickHandle={() => setOpenCollectionModal(true)}
          fullWidth={true}
        >
          <FolderArrowDownIcon className='w-4 h-4' />
          <span className='font-semibold'>Open</span>
        </Button>
        <Button
          btnType={BUTTON_TYPES.tertiary}
          classes={'rounded-none'}
          isDisabled={false}
          onClickHandle={() => setImportCollectionModal(true)}
          fullWidth={true}
        >
          <PlusIcon className='w-4 h-4' />
          <span className='font-semibold'>Import</span>
        </Button>
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
