import React from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import Tabs from '../../atoms/Tabs';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SelectEnvironment from 'components/atoms/SelectEnvironment';
import { useTabStore } from 'stores/TabStore';
import useCollectionStore from 'stores/CollectionStore';

const WorkspaceHeader = () => {
  const collections = useCollectionStore((state) => state.collections);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = useTabStore.getState().tabs.find((t) => t.id === focusTabId);
  const environmentData = focusTab ? collections.find((c) => c.id === focusTab.collectionId)?.environments : [];

  return (
    <div className='flex items-center justify-between gap-8 pr-4 border-b border-neutral-300 bg-slate-100'>
      <div className='flex items-center'>
        <Tabs />
        <button className='flex cursor-not-allowed flex-col items-center bg-slate-100 p-3.5 text-center text-slate-400'>
          <Tippy content='Coming Soon!' placement='right'>
            <PlusIcon className='w-5 h-5' />
          </Tippy>
        </button>
      </div>
      <SelectEnvironment environments={environmentData} />
    </div>
  );
};

export default WorkspaceHeader;
