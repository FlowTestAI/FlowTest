import React, { useState } from 'react';
import { FLOW_FILE_SUFFIX_REGEX } from 'constants/Common';
import { ArchiveBoxIcon, FolderIcon, DocumentIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import OptionsMenu from './OptionsMenu';

const Directory = ({ directory, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const getListDisplayTitle = (type, name) => {
    if (!type) {
      if (!name.match(FLOW_FILE_SUFFIX_REGEX)) {
        return (
          <div
            className='tw-my-1 tw-flex tw-cursor-pointer tw-items-center tw-justify-between tw-rounded tw-bg-slate-100 tw-text-cyan-700 hover:tw-bg-cyan-950 hover:tw-text-white'
            onClick={(event) => {
              //console.log(JSON.stringify(event.target.dataset));
              const clickFrom = event.target.dataset?.clickFrom;
              //console.log(`Clicked on the DIRECTORY ITEM clickFrom ==>` + clickFrom);
              if (!clickFrom || clickFrom !== 'options-menu') {
                return setIsExpanded((prev) => !prev);
              }
            }}
          >
            <div className='tw-flex tw-items-center tw-justify-start tw-gap-2 tw-p-2'>
              <ArchiveBoxIcon className='tw-h-4 tw-w-4' />
              <span>{name}</span>
            </div>
            <OptionsMenu data-click-from='options-menu' />
          </div>
        );
      }
      return (
        <div className='tw-my-1 tw-flex tw-cursor-default tw-items-center tw-justify-start tw-gap-2 tw-py-2 tw-pl-2 tw-text-cyan-700 hover:tw-bg-slate-100 hover:tw-text-cyan-950'>
          <DocumentIcon className='tw-h-4 tw-w-4' />
          <span>{name}</span>
        </div>
      );
    }

    if (type === 'folder') {
      return (
        <div
          className='tw-my-1 tw-flex tw-cursor-pointer tw-items-center tw-justify-between tw-rounded tw-bg-slate-100 tw-text-cyan-700 hover:tw-bg-cyan-950 hover:tw-text-white'
          onClick={() => {
            console.log(JSON.stringify(event.target.dataset));
            const clickFrom = event.target.dataset?.clickFrom;
            console.log(`Clicked on the DIRECTORY ITEM clickFrom ==>` + clickFrom);
            if (!clickFrom || clickFrom !== 'options-menu') {
              return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div
            className='tw-flex tw-items-center tw-justify-start tw-gap-2 tw-p-2'
            // onClick={() => setIsExpanded((prev) => !prev)}
          >
            <FolderIcon className='tw-h-4 tw-w-4' />
            <span data-type-name={type}>{name}</span>
          </div>
          <OptionsMenu data-click-from='options-menu' />
        </div>
      );
    }
  };
  return (
    <li className='tw-font-semibold'>
      {getListDisplayTitle(directory.type, directory.name)}
      {isExpanded && (
        <>
          {directory.items?.map((directory, index) => (
            <ul key={index} className='tw-list-inside tw-list-none tw-border-l-2 tw-border-slate-200 tw-pl-2'>
              <Directory directory={directory} depth={depth + 1} />
            </ul>
          ))}
        </>
      )}
    </li>
  );
};

export default Directory;
