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
import TimeSelector from 'components/atoms/common/TimeSelector';

const TabPanelHeader = () => {
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);

  const graphRunLogs = useCanvasStore((state) => state.logs);

  const [slidingPaneState, setSlidingPaneState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    title: 'Not available',
    subtitle: 'Not Available',
  });

  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);

  const sampleArrayForOptionsData = [
    { value: '1', label: '5 seconds' },
    { value: '2', label: '10 seconds' },
    { value: '3', label: '15 seconds' },
    { value: '4', label: '20 seconds' },
    { value: '5', label: '25 seconds' },
  ];
  return (
    <div className='flex items-center justify-between gap-4 px-6 py-2 border-b border-neutral-300'>
      {focusTab ? (
        <>
          <div className='text-base tracking-[0.15em]'>{focusTab.name}</div>
          <div className='flex items-center justify-between gap-4 border-l border-neutral-300'>
            <TimeSelector
              defaultOptionData={{ value: 'select_timer', label: 'Select Timer' }}
              optionsData={sampleArrayForOptionsData}
              onSelectHandler={(event) => {
                console.log(`\n \n onselectHandler`);
                console.log(event.target?.value);
                console.log(`\n \n`);
              }}
            />

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
