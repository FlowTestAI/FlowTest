import React from 'react';
import Flow, { init } from 'components/molecules/flow';
import { useTabStore } from 'stores/TabStore';
import useCanvasStore from 'stores/CanvasStore';
import TabPanelHeader from '../headers/TabPanelHeader';

const WorkspaceContent = () => {
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);

  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);

  if (focusTab) {
    console.log(`Tab changed to: ${focusTabId}`);
    console.log(focusTab);
    // perform actions based on the new tabId
    const result = init(focusTab.flowDataDraft ? focusTab.flowDataDraft : focusTab.flowData);
    setNodes(result.nodes);
    setEdges(result.edges);
  }

  return (
    <div className='flex h-full flex-col'>
      <TabPanelHeader />
      {/* {console.log(focusTab)} */}
      {focusTab && <Flow collectionId={focusTab.collectionId} />}
      {/* <div className='rachit-test'>{focusTabId}</div> */}
    </div>
  );
};

export default WorkspaceContent;
