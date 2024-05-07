import React from 'react';
import Flow, { init } from 'components/molecules/flow';
import { useTabStore } from 'stores/TabStore';
import useCanvasStore from 'stores/CanvasStore';
import TabPanelHeader from '../headers/TabPanelHeader';
import { OBJ_TYPES } from 'constants/Common';
import Env from '../environment';
import useEnvStore from 'stores/EnvStore';

const WorkspaceContent = () => {
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const setLogs = useCanvasStore((state) => state.setLogs);
  const setCollectionId = useCanvasStore((state) => state.setCollectionId);
  const setViewport = useCanvasStore((state) => state.setViewport);

  const setVariables = useEnvStore((state) => state.setVariables);

  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);

  if (focusTab) {
    console.log(`Tab changed to: ${focusTabId}`);
    console.log(focusTab);
    // perform actions based on the new tabId
    if (focusTab.type === OBJ_TYPES.flowtest) {
      const result = init(focusTab.flowDataDraft ? focusTab.flowDataDraft : focusTab.flowData);
      setNodes(result.nodes);
      setEdges(result.edges);
      setLogs(focusTab.logs);
      setCollectionId(focusTab.collectionId);
      setViewport(result.viewport);
    } else if (focusTab.type === OBJ_TYPES.environment) {
      setVariables(focusTab.variablesDraft ? focusTab.variablesDraft : focusTab.variables);
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <TabPanelHeader />
      {focusTab && (focusTab.type === OBJ_TYPES.flowtest ? <Flow collectionId={focusTab.collectionId} /> : <Env />)}
    </div>
  );
};

export default WorkspaceContent;
