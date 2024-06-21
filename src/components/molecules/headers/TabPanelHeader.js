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
import { JsonView, allExpanded, collapseAllNested, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { LogLevel } from '../flow/graph/GraphLogger';
import { ShieldCheckIcon, BarsArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import GenAIUsageDisclaimer from '../modals/GenAIUsageDisclaimer';
import { getLocalStorageItem } from 'utils/common';

const TabPanelHeader = () => {
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);

  const graphRunLogs = useCanvasStore((state) => state.logs);
  const setTimeout = useCanvasStore((state) => state.setTimeout);

  const [slidingPaneState, setSlidingPaneState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    title: 'Not available',
    subtitle: 'Not Available',
  });

  const [genAiUsageDisclaimerModalOpen, setGenAiUsageDisclaimerModalOpen] = useState(false);
  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);

  const renderFlowScan = (flowScan) => {
    if (flowScan.upload === 'disabled') {
      return (
        <div className='flex flex-col items-start'>
          <Tippy content={flowScan.message} placement='top'>
            <BarsArrowUpIcon className='h-4 w-4' />
          </Tippy>
          {'Activate Flow Scan'}
        </div>
      );
    } else if (flowScan.upload === 'success') {
      return (
        <div className='flex flex-col items-start'>
          <ShieldCheckIcon className='h-4 w-4' />
          {flowScan.url}
        </div>
      );
    } else if (flowScan.upload === 'fail') {
      return (
        <div className='flex flex-col items-start'>
          <ExclamationTriangleIcon className='h-4 w-4' />
          {flowScan.message}
          {flowScan?.reason}
        </div>
      );
    }
  };

  const renderLog = (log) => {
    if (log.logLevel === LogLevel.INFO) {
      let message = '';
      let json = undefined;
      if (log.message.trim() != '') {
        message = log.message;
      }

      if (log.node != undefined) {
        const type = log.node.type;
        const data = log.node.data;
        if (type === 'outputNode') {
          json = {
            output: data.output,
          };
        }

        if (type === 'authNode') {
          message = `${data.authType}`;
        }

        if (type === 'assertNode') {
          message = `Assert : ${data.var1} of type ${typeof data.var1} ${data.operator} ${data.var2} of type ${typeof data.var2} = ${data.result}`;
        }

        if (type === 'delayNode') {
          message = `Waiting for ${data.delay} ms`;
        }

        if (type === 'setVarNode') {
          message = `Setting Variable:  ${data.name} = ${data.value}`;
        }

        if (type === 'requestNode') {
          message = `${data.request.type.toUpperCase()} ${data.request.url}`;
          json = data;
        }
      }

      return (
        <div className='flex flex-col items-start'>
          <div className='flex flex-row items-start'>
            <div>
              <p style={{ color: 'red' }}>{log.timestamp}</p>
            </div>
            <div>
              <p> : {message}</p>
            </div>
          </div>
          <div>
            {json != undefined ? (
              <React.Fragment>
                <JsonView data={json} shouldExpandNode={collapseAllNested} style={defaultStyles} />
              </React.Fragment>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className='flex flex-col items-start'>
          <p style={{ color: 'red' }}>
            {log.timestamp} : {log.message}
          </p>
          <div>
            {log.node != undefined ? (
              <React.Fragment>
                <JsonView data={log.node.data} shouldExpandNode={collapseAllNested} style={defaultStyles} />
              </React.Fragment>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    }
  };

  const showDisclaimerMsg = () => {
    return getLocalStorageItem('show_gen_ai_disclaimer');
  };

  return (
    <>
      {focusTab ? (
        <>
          <div className='flex items-center justify-between px-4 py-3'>
            <div className='py-3 text-base tracking-[0.15em]'>{focusTab.name}</div>

            <div className='flex items-center justify-between gap-4 border-l border-gray-300 pl-4'>
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

              <div className='flex h-12 items-center justify-center'>
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
                        <DocumentTextIcon className='h-5 w-5' />
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
                    <label
                      htmlFor='graph-logs-side-sheet'
                      aria-label='close sidebar'
                      className='drawer-overlay'
                    ></label>
                    <ul className='menu min-h-full bg-base-200 p-4 text-base-content'>
                      <li key='scan'>{renderFlowScan(focusTab.run.scan)}</li>
                      {focusTab.run.logs.map((item, index) => (
                        <li key={index}>{renderLog(item)}</li>
                      ))}
                    </ul>
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
                      const showMsg = showDisclaimerMsg();
                      console.log(`\n \n showMsg : ${showMsg} \n`);
                      if (showMsg === 'false') {
                        setGenerateFlowTestModalOpen(true);
                      } else {
                        setGenAiUsageDisclaimerModalOpen(true);
                      }
                    }}
                    fullWidth={true}
                    className='flex items-center justify-between gap-x-4'
                  >
                    <SparklesIcon className='h-5 w-5' />
                    Generate
                  </Button>
                  {/* ToDo: Discuss: I think having a user profile file on disk for this setting and all the future settings will be better */}
                  {showDisclaimerMsg() === 'false' ? (
                    <GenerateFlowTestModal
                      closeFn={() => setGenerateFlowTestModalOpen(false)}
                      open={generateFlowTestModalOpen}
                      collectionId={focusTab.collectionId}
                    />
                  ) : (
                    <GenAIUsageDisclaimer
                      closeFn={() => setGenAiUsageDisclaimerModalOpen(false)}
                      open={genAiUsageDisclaimerModalOpen}
                      collectionId={focusTab.collectionId}
                    />
                  )}
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
