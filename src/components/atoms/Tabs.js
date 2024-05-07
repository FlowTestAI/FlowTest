import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTabStore } from 'stores/TabStore';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';
import { isEqual } from 'lodash';
import { OBJ_TYPES } from 'constants/Common';
import { compare } from './util';

const tabUnsavedChanges = (tab) => {
  if (tab.type === OBJ_TYPES.flowtest && tab.flowDataDraft) {
    const draftNodesSansOutput = tab.flowDataDraft.nodes.map((node) => {
      if (node.type === 'outputNode' && node.data.output) {
        const { ['output']: _, ...data } = node.data;
        return {
          ...node,
          data,
        };
      }
      return node;
    });
    if (!isEqual(tab.flowData.nodes, draftNodesSansOutput) || !isEqual(tab.flowData.edges, tab.flowDataDraft.edges)) {
      console.log('Detected unsaved changes: ', compare(tab.flowData, tab.flowDataDraft));
      return true;
    }
  } else if (tab.type === OBJ_TYPES.environment && tab.variablesDraft && !isEqual(tab.variables, tab.variablesDraft)) {
    return true;
  } else {
    false;
  }
};

const Tabs = () => {
  const tabs = useTabStore((state) => state.tabs);
  const setFocusTab = useTabStore((state) => state.setFocusTab);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
  const closeTab = useTabStore((state) => state.closeTab);
  const [closingTabId, setClosingTabId] = useState('');
  const [closingCollectionId, setClosingCollectionId] = useState('');

  // const activeTabStyles =
  //   'before:absolute before:h-[0.25rem] before:w-full before:bg-slate-300 before:content-[""] before:bottom-0 before:left-0 bg-cyan-950 text-white';
  const activeTabStyles = 'bg-cyan-900 text-white';
  const tabCommonStyles =
    'tab flex items-center gap-x-2 border-r border-neutral-300 pr-0 tracking-[0.15em] transition duration-300 ease-in text-sm flex-nowrap';
  const messageForConfirmActionModal = `You have unsaved changes in the ${focusTab?.type}, are you sure you want to close it?`;

  const handleCloseTab = (event, tab) => {
    event.stopPropagation();
    event.preventDefault();

    setClosingTabId(tab.id);
    setClosingCollectionId(tab.collectionId);

    if (tabUnsavedChanges(tab)) {
      console.debug(`Confirm close for tabId: ${tab.id} : collectionId: ${tab.collectionId}`);
      setConfirmActionModalOpen(true);
      return;
    }
    closeTab(tab.id, tab.collectionId);
  };

  return (
    <div role='tablist' className='tabs tabs-lg'>
      {tabs
        // tabs belonging to one collection will be shown at a time
        //.reverse()
        .filter((t) => t.collectionId === focusTab.collectionId)
        .map((tab, index) => {
          return (
            <div
              key={index}
              className={`${tabCommonStyles} ${focusTabId === tab.id ? activeTabStyles : ''}`}
              role='tab'
              onClick={() => {
                setFocusTab(tab.id);
                console.debug(`Selected tab: ${tab.id}`);
              }}
              data-id={tab.id}
              data-collection-id={tab.collectionId}
            >
              <a className='text-nowrap'>
                {tabUnsavedChanges(tab) ? '*' : ''}
                {tab.name}
              </a>
              {/* close needs to be a separate clickable component other wise it gets confused with above */}
              <div
                className={`flex h-full items-center px-2 ${focusTabId === tab.id ? 'text-white hover:bg-cyan-950 ' : 'text-cyan-900 hover:bg-slate-200'} `}
                data-tab-id={tab.id}
                onClick={(e) => handleCloseTab(e, tab)}
              >
                <XMarkIcon className='w-4 h-4' />
              </div>
            </div>
          );
        })}
      <ConfirmActionModal
        closeFn={() => setConfirmActionModalOpen(false)}
        open={confirmActionModalOpen}
        message={messageForConfirmActionModal}
        actionFn={() => {
          closeTab(closingTabId, closingCollectionId);
          setConfirmActionModalOpen(false);
        }}
      />
    </div>
  );
};

export default Tabs;
