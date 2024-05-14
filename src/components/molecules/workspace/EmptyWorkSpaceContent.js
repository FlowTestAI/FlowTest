import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { RectangleStackIcon, Square3Stack3DIcon } from '@heroicons/react/24/solid';
import useCollectionStore from 'stores/CollectionStore';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import ImportCollectionModal from '../modals/ImportCollectionModal';
import GenerateFlowTestModal from '../modals/GenerateFlowTestModal';
import NewFlowTestModal from '../modals/flow/NewFlowTestModal';
import NewEnvironmentFileModal from '../modals/sidebar/NewEnvironmentFileModal';
import OpenCollectionModal from '../modals/OpenCollectionModal';

const EmptyWorkSpaceContent = () => {
  const collections = useCollectionStore((state) => state.collections);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [importCollectionModal, setImportCollectionModal] = useState(false);
  const [newFlowTestModal, setNewFlowTestModal] = useState(false);
  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);
  const [newEnvironmentFileModal, setNewEnvironmentFileModal] = useState(false);
  return (
    <div className='flex items-center justify-center h-full text-cyan-900'>
      <div className='flex flex-col gap-10'>
        <div className='text-center'>
          <div className='flex items-center justify-center'>
            <RectangleStackIcon className='w-32 h-32' />
          </div>
          <p className='mt-4 text-4xl'>
            A <span className='italic font-semibold font-montserrat'>Collection</span> is a ...
          </p>
          <p className='mt-6 text-base'>More about Collection or this can be a Bullet list</p>
          <div className='flex items-center justify-between gap-6 pt-8'>
            <Button
              btnType={BUTTON_TYPES.primary}
              isDisabled={false}
              onClickHandle={() => setOpenCollectionModal(true)}
              fullWidth={true}
            >
              Open a Collection
            </Button>
            <Button
              btnType={BUTTON_TYPES.primary}
              isDisabled={false}
              onClickHandle={() => setImportCollectionModal(true)}
              fullWidth={true}
            >
              Import a Collection
            </Button>
            {collections.length ? (
              <>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setNewFlowTestModal(true)}
                  fullWidth={true}
                >
                  Create a Flow
                </Button>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setGenerateFlowTestModalOpen(true)}
                  fullWidth={true}
                >
                  Generate a Flow
                </Button>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
        {collections.length ? (
          <>
            <HorizontalDivider themeColor={'bg-cyan-900'} themeStyles={'opacity-75'} />
            <div className='text-center'>
              <div className='flex items-center justify-center'>
                <Square3Stack3DIcon className='w-32 h-32' />
              </div>
              <p className='mt-4 text-4xl'>
                An <span className='italic font-semibold font-montserrat'>Environment</span> is a ...
              </p>
              <p className='mt-6 text-base'>More about Environment or this can be a Bullet list</p>
              <div className='flex items-center justify-between gap-6 pt-8'>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setNewEnvironmentFileModal(true)}
                  fullWidth={true}
                >
                  Create Environment
                </Button>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <OpenCollectionModal closeFn={() => setOpenCollectionModal(false)} open={openCollectionModal} />
      <ImportCollectionModal closeFn={() => setImportCollectionModal(false)} open={importCollectionModal} />
      <NewFlowTestModal closeFn={() => setNewFlowTestModal(false)} open={newFlowTestModal} />
      <GenerateFlowTestModal closeFn={() => setGenerateFlowTestModalOpen(false)} open={generateFlowTestModalOpen} />
      <NewEnvironmentFileModal closeFn={() => setNewEnvironmentFileModal(false)} open={newEnvironmentFileModal} />
    </div>
  );
};

export default EmptyWorkSpaceContent;
