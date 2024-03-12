import React from 'react';
import Flow from 'components/molecules/flow';
import WorkspaceContentHeader from 'components/molecules/headers/WorkspaceContentHeader';
import { useTabStore } from 'stores/TabStore';

const WorkspaceContent = () => {
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  return (
    <div className='flex flex-col h-full'>
      <WorkspaceContentHeader />
      {/* {console.log(focusTab)} */}
      {focusTab && <Flow tabId={focusTab.id} collectionId={focusTab.collectionId} flowData={focusTab.flowData} />}
      {/* <div className='rachit-test'>{focusTabId}</div> */}
    </div>
  );
};

export default WorkspaceContent;
