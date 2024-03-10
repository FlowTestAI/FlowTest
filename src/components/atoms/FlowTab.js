import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTabStore } from 'stores/TabStore';

const FlowTab = () => {
  const tabs = useTabStore((state) => state.tabs);
  const setFocusTab = useTabStore((state) => state.setFocusTab);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const closeTab = useTabStore((state) => state.closeTab);
  const activeTabStyles =
    'before:absolute before:h-[0.25rem] before:w-full before:bg-slate-300 before:content-[""] before:bottom-0 before:left-0';
  const tabCommonStyles =
    'tab flex items-center gap-x-2 border-r border-neutral-300 bg-transparent pr-0 tracking-wider transition duration-500 ease-in';
  return (
    <div role='tablist' className='tabs tabs-lg'>
      {tabs.map((tab, index) => {
        return (
          <a
            role='tab'
            className={`${tabCommonStyles} ${focusTabId === tab.id ? activeTabStyles : ''}`}
            key={index}
            data-id={tab.id}
            data-collection-id={tab.collectionId}
            onClick={() => {
              setFocusTab(tab.id);
              console.log(`CLICKED THE ${tab.id}`);
            }}
          >
            {tab.name}
            <div
              className='flex h-full items-center px-2 hover:rounded hover:rounded-l-none hover:bg-slate-200'
              onClick={() => {
                closeTab(tab.id, tab.collectionId);
              }}
            >
              <XMarkIcon className='h-4 w-4' />
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default FlowTab;
