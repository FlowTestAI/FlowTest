import React, { useState } from 'react';
import { DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/20/solid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SaveFlowModal from '../modals/SaveFlowModal';

import { useTabStore } from 'stores/TabStore';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import GenerateFlowTestModal from '../modals/GenerateFlowTestModal';

const TabPanelHeader = () => {
  const focusTabId = useTabStore.getState().focusTabId;
  const tabs = useTabStore.getState().tabs;
  const focusTab = tabs.find((t) => t.id === focusTabId);

  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);

  return (
    <div className='flex items-center justify-between gap-4 border-b border-neutral-300 px-6 py-2'>
      {focusTab ? (
        <>
          <div className='text-base tracking-[0.15em]'>{focusTab.name}</div>
          <div className='flex items-center justify-between gap-x-4 border-l border-neutral-300'>
            <div className='flex items-center justify-between gap-x-4 pl-4'>
              <SaveFlowModal tab={focusTab} />
              <button>
                <Tippy content='Coming Soon!' placement='top'>
                  <DocumentArrowDownIcon className='h-5 w-5' />
                </Tippy>
              </button>
              <button>
                <Tippy content='Coming Soon!' placement='top'>
                  <DocumentArrowUpIcon className='h-5 w-5' />
                </Tippy>
              </button>
            </div>
            <div className='gen_ai_button border-l border-neutral-300 pl-4'>
              <Button
                btnType={BUTTON_TYPES.tertiary}
                isDisabled={false}
                onClickHandle={() => setGenerateFlowTestModalOpen(true)}
                fullWidth={true}
              >
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
        <div className='text-base tracking-[0.15em]'></div>
      )}
    </div>
  );
};

TabPanelHeader.propTypes = {};

export default TabPanelHeader;
