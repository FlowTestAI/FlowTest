import React, { useState } from 'react';
import { DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/20/solid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SaveFlowModal from '../modals/SaveFlowModal';
import { useTabStore } from 'stores/TabStore';
import SelectEnvironment from 'components/atoms/SelectEnvironment';
import useCollectionStore from 'stores/CollectionStore';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import GenerateFlowTestModal from '../modals/GenerateFlowTestModal';

const TabPanelHeader = () => {
  const focusTabId = useTabStore.getState().focusTabId;
  const tabs = useTabStore.getState().tabs;
  const focusTab = tabs.find((t) => t.id === focusTabId);
  const collections = useCollectionStore((state) => state.collections);
  const environmentData = focusTab ? collections.find((c) => c.id === focusTab.collectionId)?.environments : [];

  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);

  return (
    <div className='flex items-center justify-between gap-4 px-6 py-2 border-b border-neutral-300'>
      <div className='text-base tracking-[0.15em]'>{focusTab.name}</div>
      <div className='flex items-center justify-between border-l gap-x-4 border-neutral-300'>
        <div className='flex items-center justify-between pl-4 gap-x-4'>
          <SaveFlowModal tab={focusTab} focusTab={focusTabId} />
          <button>
            <Tippy content='Coming Soon!' placement='top'>
              <DocumentArrowDownIcon className='w-5 h-5' />
            </Tippy>
          </button>
          <button>
            <Tippy content='Coming Soon!' placement='top'>
              <DocumentArrowUpIcon className='w-5 h-5' />
            </Tippy>
          </button>
        </div>
        <SelectEnvironment environments={environmentData} />
        <div className='pl-4 border-l gen_ai_button border-neutral-300'>
          <Button
            btnType={BUTTON_TYPES.tertiary}
            isDisabled={false}
            onClickHandle={() => setGenerateFlowTestModalOpen(true)}
            fullWidth={true}
          >
            Generate
          </Button>
          <GenerateFlowTestModal closeFn={() => setGenerateFlowTestModalOpen(false)} open={generateFlowTestModalOpen} />
        </div>
      </div>
    </div>
  );
};

TabPanelHeader.propTypes = {};

export default TabPanelHeader;
