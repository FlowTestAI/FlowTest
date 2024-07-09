import React, { useState } from 'react';
import { SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SaveFlowModal from '../modals/SaveFlowModal';
import { useTabStore } from 'stores/TabStore';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES, OBJ_TYPES } from 'constants/Common';
import GenerateFlowTestModal from '../modals/GenerateFlowTestModal';
import useCanvasStore from 'stores/CanvasStore';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import TimeoutSelector from 'components/atoms/common/TimeoutSelector';
import { timeoutForGraphRun } from 'components/molecules/flow/utils';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';
// import { JsonView, allExpanded, collapseAllNested, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
// import { LogLevel } from '../flow/graph/GraphLogger';

import GenAIUsageDisclaimer from '../modals/GenAIUsageDisclaimer';
import useSettingsStore from 'stores/SettingsStore';
import FlowLogs from '../sideSheets/FlowLogs';

const TabPanelHeader = () => {
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);

  const setTimeout = useCanvasStore((state) => state.setTimeout);

  const [slidingPaneState, setSlidingPaneState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    title: 'Not available',
    subtitle: 'Not Available',
  });

  const [genAiUsageDisclaimerModalOpen, setGenAiUsageDisclaimerModalOpen] = useState(false);
  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);

  return (
    <>
      {focusTab ? (
        <>
          <div className='flex items-center justify-between px-4 py-3'>
            <div className='py-3 text-base tracking-[0.15em]'>{focusTab.name}</div>

            <div className='flex items-center justify-between gap-4 pl-4 border-l border-gray-300'>
              {focusTab.type === OBJ_TYPES.flowtest && (
                // ToDo: Check this
                <div className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded border border-cyan-900 bg-background-light px-4 py-2.5 text-cyan-900 transition hover:bg-background'>
                  <TimeoutSelector
                    optionsData={timeoutForGraphRun}
                    onSelectHandler={(timeValue) => {
                      setTimeout(timeValue);
                    }}
                  />
                </div>
              )}

              <div className='flex items-center justify-center h-12'>
                <SaveFlowModal tab={focusTab} />
              </div>
              {focusTab.type === OBJ_TYPES.flowtest && focusTab.run.logs && focusTab.run.logs.length != 0 ? (
                <div>
                  <Button
                    id='graph-logs-side-sheet'
                    btnType={BUTTON_TYPES.secondary}
                    isDisabled={false}
                    onClickHandle={() =>
                      setSlidingPaneState({
                        isPaneOpen: true,
                        isPaneOpenLeft: false,
                      })
                    }
                    fullWidth={true}
                    onlyIcon={true}
                    padding={'px-4 py-2.5'}
                  >
                    <Tippy content='Logs' placement='top'>
                      <label htmlFor='graph-logs-side-sheet'>
                        <DocumentTextIcon className='w-5 h-5' />
                      </label>
                    </Tippy>
                  </Button>
                  <SlidingPane
                    className='side-sheet'
                    overlayClassName='side-sheet-overlay'
                    isOpen={slidingPaneState.isPaneOpen}
                    title={focusTab.name}
                    width='45%'
                    onRequestClose={() => {
                      // triggered on "<" on left top click or on outside click
                      setSlidingPaneState({
                        isPaneOpen: false,
                        isPaneOpenLeft: false,
                        title: 'closed',
                        subtitle: 'closed',
                      });
                    }}
                  >
                    <FlowLogs logsData={focusTab}></FlowLogs>
                  </SlidingPane>
                </div>
              ) : (
                <></>
              )}
              {focusTab.type === OBJ_TYPES.flowtest && (
                <div className='gen_ai_button'>
                  <Button
                    btnType={BUTTON_TYPES.secondary}
                    isDisabled={false}
                    onClickHandle={() => {
                      if (useSettingsStore.getState().genAIUsageDisclaimer === true) {
                        setGenerateFlowTestModalOpen(true);
                      } else {
                        setGenAiUsageDisclaimerModalOpen(true);
                      }
                    }}
                    fullWidth={true}
                    className='flex items-center justify-between gap-x-4'
                  >
                    <SparklesIcon className='w-5 h-5' />
                    Generate
                  </Button>
                  <GenerateFlowTestModal
                    closeFn={() => setGenerateFlowTestModalOpen(false)}
                    open={generateFlowTestModalOpen}
                    collectionId={focusTab.collectionId}
                  />
                  <GenAIUsageDisclaimer
                    closeFn={() => setGenAiUsageDisclaimerModalOpen(false)}
                    open={genAiUsageDisclaimerModalOpen}
                    openGenerateFlowTestModal={() => setGenerateFlowTestModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
          <HorizontalDivider />
        </>
      ) : (
        ''
      )}
    </>
  );
};

TabPanelHeader.propTypes = {};

export default TabPanelHeader;
