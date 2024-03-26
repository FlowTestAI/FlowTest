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
import { BUTTON_TYPES } from 'constants/Common';
import GenerateFlowTestModal from '../modals/GenerateFlowTestModal';
import useCanvasStore from 'stores/CanvasStore';

const TabPanelHeader = () => {
  const focusTabId = useTabStore((state) => state.focusTabId);
  const tabs = useTabStore((state) => state.tabs);
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const graphRunLogs = useCanvasStore((state) => state.logs);
  console.log('graph logs: ', graphRunLogs);

  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);

  return (
    <div className='flex items-center justify-between gap-4 px-6 py-2 border-b border-neutral-300'>
      {focusTab ? (
        <>
          <div className='text-base tracking-[0.15em]'>{focusTab.name}</div>
          <div className='flex items-center justify-between border-l gap-x-4 border-neutral-300'>
            <div className='flex items-center justify-between pl-4 gap-x-4'>
              <SaveFlowModal tab={focusTab} />
              {/* ToDo: Create our own side sheet component */}
              {graphRunLogs.length != 0 ? (
                <div className='drawer drawer-end'>
                  <input id='graph-logs-side-sheet' type='checkbox' className='drawer-toggle' />
                  <div className='cursor-pointer drawer-content'>
                    <Tippy content='Logs' placement='top'>
                      <label htmlFor='graph-logs-side-sheet'>
                        <DocumentTextIcon className='w-5 h-5' />
                      </label>
                    </Tippy>
                  </div>

                  <div className='z-50 drawer-side'>
                    <label
                      htmlFor='graph-logs-side-sheet'
                      aria-label='close sidebar'
                      className='drawer-overlay'
                    ></label>
                    <ul className='min-h-full p-4 menu w-80 bg-base-200 text-base-content'>
                      {graphRunLogs.map((item, index) => (
                        <li key={index}>
                          <div>{console.log(item)}</div>
                          <a>{item}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <button>
                <Tippy content='Import - Coming Soon!' placement='top'>
                  <DocumentArrowDownIcon className='w-5 h-5 fill-neutral-200 text-neutral-400' />
                </Tippy>
              </button>
              <button>
                <Tippy content='Export - Coming Soon!' placement='top'>
                  <DocumentArrowUpIcon className='w-5 h-5 fill-neutral-200 text-neutral-400' />
                </Tippy>
              </button>
            </div>
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
              />
            </div>
          </div>
        </>
      ) : (
        <div className='text-base tracking-[0.15em]'> Please select a flow test from the sidebar </div>
      )}
    </div>
  );
};

TabPanelHeader.propTypes = {};

export default TabPanelHeader;
