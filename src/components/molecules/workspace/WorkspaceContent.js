import React from 'react';
import Flow, { init } from 'components/molecules/flow';
import { useTabStore } from 'stores/TabStore';
import useCanvasStore from 'stores/CanvasStore';
import TabPanelHeader from '../headers/TabPanelHeader';
import { OBJ_TYPES } from 'constants/Common';
import Env from '../environment';
import useEnvStore from 'stores/EnvStore';
import EmptyWorkSpaceContent from './EmptyWorkSpaceContent';

const WorkspaceContent = () => {
  const setIntialState = useCanvasStore((state) => state.setIntialState);
  const setLogs = useCanvasStore((state) => state.setLogs);
  const setCollectionId = useCanvasStore((state) => state.setCollectionId);

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
      setIntialState(result);
      setLogs(focusTab.logs);
      setCollectionId(focusTab.collectionId);
    } else if (focusTab.type === OBJ_TYPES.environment) {
      setVariables(focusTab.variablesDraft ? focusTab.variablesDraft : focusTab.variables);
    }
  }

  return (
    <div className='flex h-full flex-col'>
      <TabPanelHeader />
      {focusTab ? (
        focusTab.type === OBJ_TYPES.flowtest ? (
          <Flow tab={focusTab} collectionId={focusTab.collectionId} />
        ) : (
          <Env tab={focusTab} />
        )
      ) : (
        <EmptyWorkSpaceContent />
      )}
    </div>
  );
};

export default WorkspaceContent;
