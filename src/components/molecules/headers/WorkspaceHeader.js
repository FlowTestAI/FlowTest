import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import Tabs from '../../atoms/Tabs';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SelectEnvironment from 'components/atoms/SelectEnvironment';
import { useTabStore } from 'stores/TabStore';
import useCollectionStore from 'stores/CollectionStore';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES, BUTTON_INTENT_TYPES } from 'constants/Common';
import NewFlowTestModal from '../modals/flow/NewFlowTestModal';

const WorkspaceHeader = () => {
  const collections = useCollectionStore((state) => state.collections);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = useTabStore.getState().tabs.find((t) => t.id === focusTabId);
  const environmentData = focusTab ? collections.find((c) => c.id === focusTab.collectionId)?.environments : [];
  const [newFlowTestModal, setNewFlowTestModal] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between pr-4 min-h-12'>
        <div className='flex items-center overflow-x-auto'>
          <Tabs />
          <div className='inline-flex items-center justify-center whitespace-nowrap hover:bg-background-light'>
            <Button
              btnType={BUTTON_TYPES.tertiary}
              classes={'min-h-12'}
              isDisabled={false}
              onClickHandle={() => setNewFlowTestModal(true)}
              fullWidth={true}
            >
              <PlusIcon className='w-5 h-5 outline-none' />
            </Button>
          </div>
        </div>
        <SelectEnvironment environments={environmentData} />
      </div>
      <NewFlowTestModal closeFn={() => setNewFlowTestModal(false)} open={newFlowTestModal} />
    </>
  );
};

export default WorkspaceHeader;
