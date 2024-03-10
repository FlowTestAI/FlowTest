import React, { useState } from 'react';
import { FLOW_FILE_SUFFIX_REGEX } from 'constants/Common';
import { ArchiveBoxIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';
import OptionsMenu from './OptionsMenu';

const Directory = ({ directory, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getListDisplayTitle = (type, name) => {
    // ToDo: type field should always be there in the response
    if (!type) {
      // ToDo: May be we need a value for, type === collection in the response
      if (!name.match(FLOW_FILE_SUFFIX_REGEX)) {
        // this is for collections tab thus we have archive box icon
        return (
          <div
            className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out hover:bg-slate-100'
            onClick={(event) => {
              const clickFromElementDataSet = event.target.dataset;
              const clickFrom = clickFromElementDataSet?.clickFrom;
              if (!clickFrom || clickFrom !== 'options-menu') {
                return setIsExpanded((prev) => !prev);
              }
            }}
          >
            <div className='flex items-center justify-start gap-2 px-2 py-1'>
              <ArchiveBoxIcon className='h-4 w-4' />
              <span>{name}</span>
            </div>
            <OptionsMenu
              data-click-from='options-menu'
              directory={directory}
              data-item-type='collections'
              itemType={'collections'}
            />
          </div>
        );
      }
      // This is for document or file
      return (
        <div
          className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out hover:bg-slate-100'
          onClick={(event) => {
            const clickFromElementDataSet = event.target.dataset;
            const clickFrom = clickFromElementDataSet?.clickFrom;
            if (!clickFrom || clickFrom !== 'options-menu') {
              return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <DocumentIcon className='h-4 w-4' />
            <span>{name}</span>
          </div>
          <OptionsMenu data-click-from='options-menu' directory={directory} data-item-type='file' itemType={'file'} />
        </div>
      );
    }

    if (type === 'folder') {
      return (
        <div
          className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out hover:bg-slate-100'
          onClick={() => {
            const clickFrom = event.target.dataset?.clickFrom;
            if (!clickFrom || clickFrom !== 'options-menu') {
              return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <FolderIcon className='h-4 w-4' />
            <span data-type-name={type}>{name}</span>
          </div>
          <OptionsMenu
            data-click-from='options-menu'
            directory={directory}
            data-item-type='folder'
            itemType={'folder'}
          />
        </div>
      );
    }
  };
  return (
    <>
      <li>
        {getListDisplayTitle(directory.type, directory.name)}
        {isExpanded && (
          <>
            {directory.items?.map((directory, index) => (
              <ul
                key={index}
                className='before:absolute before:bottom-0 before:top-0 before:w-[1px] before:bg-slate-300 before:opacity-100'
              >
                <Directory directory={directory} depth={depth + 1} />
              </ul>
            ))}
          </>
        )}
      </li>
    </>
  );
};

export default Directory;
