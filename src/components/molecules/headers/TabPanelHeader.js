import React, { useState } from 'react';
import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  SparklesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
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
import { getAllFlowTests } from 'stores/utils';
import useCollectionStore from 'stores/CollectionStore';

const TabPanelHeader = () => {
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const collection = focusTab
    ? useCollectionStore.getState().collections.find((c) => c.id === focusTab.collectionId)
    : undefined;

  const graphRunLogs = useCanvasStore((state) => state.logs);
  const preFlow = useCanvasStore((state) => state.preFlow);
  const postFlow = useCanvasStore((state) => state.postFlow);
  const setPreFlow = useCanvasStore((state) => state.setPreFlow);
  const setPostFlow = useCanvasStore((state) => state.setPostFlow);
  const [slidingPaneState, setSlidingPaneState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    title: 'Not available',
    subtitle: 'Not Available',
  });

  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);
  const flowTests = getAllFlowTests(collection);

  return (
    <div className='flex items-center justify-between gap-4 px-6 py-2 border-b border-neutral-300'>
      {focusTab ? (
        <>
          <div className='text-base tracking-[0.15em]'>{focusTab.name}</div>
          <div className='flex items-center justify-between gap-4 border-l border-neutral-300'>
            <div className='flex items-center justify-between gap-4 px-4 border-r border-neutral-300'>
              <div>
                <b>{'Pre Flow'}</b>
              </div>
              <select
                onChange={(e) => setPreFlow(e.target.value)}
                name='pre-flow'
                value={preFlow}
                className='h-12 outline-none max-w-32'
              >
                <option key='None' value=''>
                  None
                </option>
                {flowTests.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
              <div>
                <b>{'Post Flow'}</b>
              </div>
              <select
                onChange={(e) => setPostFlow(e.target.value)}
                name='post-flow'
                value={postFlow}
                className='h-12 pl-4 border-l outline-none max-w-32 border-neutral-300'
              >
                <option key='None' value=''>
                  None
                </option>
                {flowTests.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>
            <SaveFlowModal tab={focusTab} />
            {focusTab.type === OBJ_TYPES.flowtest && graphRunLogs.length != 0 ? (
              <>
                <div
                  id='graph-logs-side-sheet'
                  className='flex items-center justify-between h-12 pl-4 border-l outline-none max-w-32 border-neutral-300'
                  onClick={() =>
                    setSlidingPaneState({
                      isPaneOpen: true,
                      isPaneOpenLeft: false,
                    })
                  }
                >
                  <Tippy content='Logs' placement='top'>
                    <label htmlFor='graph-logs-side-sheet'>
                      <DocumentTextIcon className='w-5 h-5' />
                    </label>
                  </Tippy>
                </div>
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
                  <label htmlFor='graph-logs-side-sheet' aria-label='close sidebar' className='drawer-overlay'></label>
                  <ul className='min-h-full p-4 menu w-80 bg-base-200 text-base-content'>
                    {graphRunLogs.map((item, index) => (
                      <li key={index}>
                        <a>{item}</a>
                      </li>
                    ))}
                  </ul>
                </SlidingPane>
              </>
            ) : (
              <></>
            )}
            {focusTab.type === OBJ_TYPES.flowtest && (
              <div className='pl-4 border-l gen_ai_button border-neutral-300'>
                <Button
                  btnType={BUTTON_TYPES.tertiary}
                  isDisabled={false}
                  onClickHandle={() => setGenerateFlowTestModalOpen(true)}
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
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='text-base tracking-[0.15em]'> Please select a flow from the sidebar </div>
      )}
    </div>
  );
};

TabPanelHeader.propTypes = {};

export default TabPanelHeader;
