import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTabStore } from 'stores/TabStore';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';
import Flow from 'components/molecules/flow';

const Tabs = () => {
  const tabs = useTabStore((state) => state.tabs);
  const setFocusTab = useTabStore((state) => state.setFocusTab);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
  const closeTab = useTabStore((state) => state.closeTab);
  const [closingTabId, setClosingTabId] = useState('');
  const [closingCollectionId, setClosingCollectionId] = useState('');
  const activeTabStyles =
    'before:absolute before:h-[0.25rem] before:w-full before:bg-slate-300 before:content-[""] before:bottom-0 before:left-0';
  const tabCommonStyles =
    'tab flex items-center gap-x-2 border-r border-neutral-300 bg-transparent pr-0 tracking-[0.15em] transition duration-500 ease-in text-sm';
  const messageForConfirmActionModal = 'You have unsaved changes in the flowtest, are you sure you want to close it?';
  const handleCloseTab = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const tabId = event.currentTarget.dataset.tabId;
    const { isDirty, collectionId } = tabs.find((tab) => {
      if (tab.id === tabId) return tab;
    });
    setClosingTabId(tabId);
    setClosingCollectionId(collectionId);

    if (isDirty) {
      console.debug(`Confirm close for tabId: ${tabId} : collectionId: ${collectionId}`);
      setConfirmActionModalOpen(true);
      return;
    }
    closeTab(tabId, collectionId);
  };
  return (
    <div role='tablist' className='tabs tabs-lg'>
      {tabs
        // tabs belonging to one collection will be shown at a time
        .filter((t) => t.collectionId === focusTab.collectionId)
        .map((tab, index) => {
          return (
            <>
              <input type='radio' name={tab.name} role='tab' className='tab' aria-label={`Tab ${index + 1}`} />
              {/* <div
                key={index}
                className={`${tabCommonStyles} ${focusTabId === tab.id ? activeTabStyles : ''}`}
                role='tab'
                onClick={() => {
                  setFocusTab(tab.id);
                  console.debug(`Selected tab: ${tab.id}`);
                }}
                data-id={tab.id}
                data-collection-id={tab.collectionId}
                name={`tab-${index + 1}`}
                aria-label={`Tab ${index + 1}`}
              >
                <a>{tab.name}</a>
                <div
                  className='flex items-center h-full px-2 hover:rounded hover:rounded-l-none hover:bg-slate-200'
                  data-tab-id={tab.id}
                  onClick={handleCloseTab}
                >
                  <XMarkIcon className='w-4 h-4' />
                </div>
              </div> */}
              {console.log(
                `Rendering TABS: \n id: ${tab.id} \n collection ID : ${tab.collectionId}  \n Flow Data : ${JSON.stringify(tab.flowData)}`,
              )}
              <div role='tabpanel' className='tab-content'>
                <div className='p-4'>{tab.id}</div>
                <Flow tabId={tab.id} collectionId={tab.collectionId} flowData={tab.flowData} />
              </div>
            </>
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
