import React from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import Tabs from '../../atoms/Tabs';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SelectEnvironment from 'components/atoms/SelectEnvironment';
import { useTabStore } from 'stores/TabStore';
import useCollectionStore from 'stores/CollectionStore';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES, BUTTON_INTENT_TYPES } from 'constants/Common';

const WorkspaceHeader = () => {
  const collections = useCollectionStore((state) => state.collections);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = useTabStore.getState().tabs.find((t) => t.id === focusTabId);
  const environmentData = focusTab ? collections.find((c) => c.id === focusTab.collectionId)?.environments : [];

  return (
    <div className='flex items-center justify-between pr-4 min-h-12'>
      <div className='flex items-center overflow-x-auto'>
        <Tabs />
        <Button btnType={BUTTON_TYPES.disabled} isDisabled={true} fullWidth={true}>
          <Tippy content='Coming Soon!' placement='right'>
            <PlusIcon className='w-5 h-5 outline-none' />
          </Tippy>
        </Button>
      </div>
      <SelectEnvironment environments={environmentData} />
    </div>
  );
};

export default WorkspaceHeader;
