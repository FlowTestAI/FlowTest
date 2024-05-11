import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTabStore } from 'stores/TabStore';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';
import { isEqual } from 'lodash';
import { OBJ_TYPES } from 'constants/Common';
import { isSaveNeeded } from './util';
import { saveHandle } from 'components/molecules/modals/SaveFlowModal';

const tabUnsavedChanges = (tab) => {
  if (tab.type === OBJ_TYPES.flowtest && tab.flowDataDraft) {
    return isSaveNeeded(tab.flowData, tab.flowDataDraft);
  } else if (tab.type === OBJ_TYPES.environment && tab.variablesDraft && !isEqual(tab.variables, tab.variablesDraft)) {
    return true;
  } else {
    return false;
  }
};

const Tabs = () => {
  const tabs = useTabStore((state) => state.tabs);
  const setFocusTab = useTabStore((state) => state.setFocusTab);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
  const closeTab = useTabStore((state) => state.closeTab);
  const [closingTab, setClosingTab] = useState('');
  const [closingCollectionId, setClosingCollectionId] = useState('');
  // ToDo: change color according to theme
  const activeTabStyles = 'bg-cyan-900 text-white';
  const tabCommonStyles =
    'tab flex items-center gap-x-2 border-r border-neutral-300 pr-0 tracking-[0.15em] transition duration-300 ease-in text-sm flex-nowrap';
  const messageForConfirmActionModal = `You have unsaved changes in the ${focusTab?.type}, are you sure you want to close it?`;

  const handleCloseTab = (event, tab) => {
    event.stopPropagation();
    event.preventDefault();

    setClosingTab(tab);
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
              <div
                // ToDo: change color according to theme
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
        closeFn={() => {
          closeTab(closingTab.id, closingCollectionId);
          setConfirmActionModalOpen(false);
        }}
        open={confirmActionModalOpen}
        message={messageForConfirmActionModal}
        actionFn={() => {
          saveHandle(closingTab);
          closeTab(closingTab.id, closingCollectionId);
          setConfirmActionModalOpen(false);
        }}
        closeModal={() => setConfirmActionModalOpen(false)}
        leftButtonMessage={'Close Withuout Saving'}
        rightButtonMessage={'Save And Close'}
      />
    </div>
  );
};

export default Tabs;
