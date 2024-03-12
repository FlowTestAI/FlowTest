import React from 'react';
import { DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/20/solid';
import EditableTextItem from '../../atoms/EditableTextItem';
import SelectAuthKeys from '../../atoms/SelectAuthKeys';
import SaveFlowModal from '../modals/SaveFlowModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTabStore } from 'stores/TabStore';

const WorkspaceContentHeader = () => {
  const focusTabId = useTabStore.getState().focusTabId;
  const tabs = useTabStore.getState().tabs;
  const focusTab = tabs.find((t) => t.id === focusTabId);

  return (
    <div className='flex items-center justify-between gap-4 px-6 py-2 border-b border-neutral-300'>
      {focusTab && (
        <>
          <div className='text-xl'>{focusTab.name}</div>
          <div className='flex items-center justify-between gap-x-4'>
            {/* <SelectAuthKeys /> */}
            <SaveFlowModal tab={focusTab} />
            <button>
              <Tippy content='Coming Soon!' placement='top'>
                <DocumentArrowDownIcon className='w-5 h-5' />
              </Tippy>
            </button>
            <button>
              <Tippy content='Coming Soon!' placement='top'>
                <DocumentArrowUpIcon className='w-5 h-5' />
              </Tippy>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspaceContentHeader;
