import React from 'react';
import { DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/20/solid';
import EditableTextItem from '../../atoms/EditableTextItem';
import SelectAuthKeys from '../../atoms/SelectAuthKeys';
import SaveFlowModal from '../modals/SaveFlowModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const WorkspaceContentHeader = () => {
  return (
    <div className='tw-border-[rgba(128, 128, 128, 0.35)] tw-flex tw-items-center tw-justify-between tw-gap-4 tw-border-b tw-px-6 tw-py-2'>
      <EditableTextItem initialText='Untitled Flow' />
      <div className='tw-flex tw-items-center tw-justify-between tw-gap-x-4'>
        <SelectAuthKeys />
        <SaveFlowModal />
        <button>
          <Tippy content='Coming Soon!' placement='top'>
            <DocumentArrowDownIcon className='tw-h-5 tw-w-5' />
          </Tippy>
        </button>
        <button>
          <Tippy content='Coming Soon!' placement='top'>
            <DocumentArrowUpIcon className='tw-h-5 tw-w-5' />
          </Tippy>
        </button>
      </div>
    </div>
  );
};

export default WorkspaceContentHeader;
