import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTabStore } from 'stores/TabStore';
import Flow from 'components/molecules/flow';
import TabPanelHeader from 'components/molecules/headers/TabPanelHeader';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Tabs = (props) => {
  const tabs = useTabStore((state) => state.tabs);
  const focusTabId = useTabStore((state) => state.focusTabId);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const setFocusTab = useTabStore((state) => state.setFocusTab);
  // const tabFlowData = []; // this is important to gather the flow data by order of tabs

  const messageForConfirmActionModal = 'You have unsaved changes in the flowtest, are you sure you want to close it?';

  const closeTab = useTabStore((state) => state.closeTab);

  const [closingTabId, setClosingTabId] = useState('');
  const [closingCollectionId, setClosingCollectionId] = useState('');
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
  const handleCloseTab = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const tabId = event.currentTarget.dataset.tabId;
    console.log(`\n handleCloseTab for TAB, ID: ${tabId} \n`);
    const { isDirty, collectionId } = tabs.find((tab) => {
      if (tab.id === tabId) return tab;
    });
    console.log(`\n handleCloseTab for TAB, ID: ${tabId} AFTER TABS FIND\n`);
    setClosingTabId(tabId);
    setClosingCollectionId(collectionId);
    console.log(`\n handleCloseTab for TAB, ID: ${tabId} AFTER SETTING STATE\n`);

    if (isDirty) {
      console.log(`\n handleCloseTab for TAB, ID: ${tabId} INSIDE ISDIRTY\n`);
      console.debug(`Confirm close for tabId: ${tabId} : collectionId: ${collectionId}`);
      setConfirmActionModalOpen(true);
      return;
    }
    console.log(`\n handleCloseTab for TAB, ID: ${tabId} BEFORE CLOSING TAB\n`);
    closeTab(tabId, collectionId);
    console.log(`\n handleCloseTab for TAB, ID: ${tabId} AFTER CLOSING TAB\n`);
  };

  // const activeTabStyles =
  //   'before:absolute before:h-[0.25rem] before:w-full before:bg-slate-300 before:content-[""] before:bottom-0 before:left-0';
  // const tabCommonStyles =
  //   'tab flex items-center gap-x-2 border-r border-neutral-300 bg-transparent pr-0 tracking-[0.15em] transition duration-500 ease-in text-sm';

  return (
    <>
      <Tab.Group>
        <Tab.List className={'justify-left flex items-center border-b border-neutral-300 bg-slate-100'}>
          {tabs
            // tabs belonging to one collection will be shown at a time
            .filter((t) => t.collectionId === focusTab.collectionId)
            .map((tab, index) => {
              return (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    classNames(
                      'tab flex items-center gap-x-2 border-r border-neutral-300 bg-transparent pr-0 text-sm tracking-[0.15em]',
                      'h-12 transition duration-500 ease-in focus:outline-none',
                      selected
                        ? 'before:absolute before:bottom-0 before:left-0 before:h-[0.25rem] before:w-full before:bg-slate-300 before:content-[""]'
                        : '',
                    )
                  }
                  onClick={() => {
                    console.log(`\n \n \n TAB ID CLICKED : ${tab.id}\n \n`);
                    setFocusTab(tab.id);
                  }}
                >
                  <div>
                    {tab.name}
                    {console.log(
                      `Rendering TABS: \n id: ${tab.id} \n collection ID : ${tab.collectionId}  \n Flow Data : ${JSON.stringify(tab.flowData)}`,
                    )}
                  </div>
                  <div
                    className='flex items-center h-full px-2 hover:rounded hover:rounded-l-none hover:bg-slate-200'
                    data-tab-id={tab.id}
                    onClick={handleCloseTab}
                  >
                    <XMarkIcon className='w-4 h-4' />
                  </div>
                </Tab>
              );
            })}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tabData, index) => (
            <Tab.Panel key={index} className={classNames('h-[80vh]')}>
              <TabPanelHeader />
              {console.log(`\n \n \n TabPanelHeader: tabData.flowData : ${JSON.stringify(tabData.flowData)} \n \n \n`)}
              <Flow tabId={tabData.id} collectionId={tabData.collectionId} flowData={tabData.flowData} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
      <ConfirmActionModal
        closeFn={() => setConfirmActionModalOpen(false)}
        open={confirmActionModalOpen}
        message={messageForConfirmActionModal}
        actionFn={() => {
          closeTab(closingTabId, closingCollectionId);
          setConfirmActionModalOpen(false);
        }}
      />
    </>
  );
};

Tabs.propTypes = {};

export default Tabs;
