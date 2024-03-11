import React, { useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import FlowTab from '../../atoms/FlowTab';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SelectEnvironment from 'components/atoms/SelectEnvironment';
import { useTabStore } from 'stores/TabStore';
import useCollectionStore from 'stores/CollectionStore';

const WorkspaceHeader = () => {
  const collections = useCollectionStore((state) => state.collections);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  let environmentData = [];

  useEffect(() => {
    const tab = tabs?.find((tab) => tab.id === focusTabId);
    // console.log(`tab?.collectionId :: ${tab?.collectionId}`);
    // console.log(`collection.id:: ${JSON.stringify(collections)}`);
    const environments = collections?.find((collection) => tab?.collectionId === collection.id);
    environmentData = environments?.length ? environments.enviroments : [];
    // console.log(`environmentData :: ${environmentData}`);
  }, [collections, focusTabId, tabs]);

  return (
    <div className='flex items-center justify-between gap-8 border-b border-neutral-300 bg-slate-100 pr-4'>
      <div className='flex items-center'>
        <FlowTab />
        <button className='flex cursor-not-allowed flex-col items-center bg-slate-100 p-3.5 text-center text-slate-400'>
          <Tippy content='Coming Soon!' placement='right'>
            <PlusIcon className='h-5 w-5' />
          </Tippy>
        </button>
      </div>
      <SelectEnvironment environments={environmentData} />
    </div>
  );
};

export default WorkspaceHeader;
