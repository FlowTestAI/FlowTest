import React, { useState } from 'react';
import { FLOW_FILE_SUFFIX_REGEX } from 'constants/Common';
import { ArchiveBoxIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';
import OptionsMenu from './OptionsMenu';
import { readFlowTest } from 'service/collection';

const Directory = ({ collectionId, item, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getListDisplayTitle = () => {
    if (item.type === 'collection') {
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
            <span>{item.name}</span>
          </div>
          <OptionsMenu
            data-click-from='options-menu'
            directory={item}
            data-item-type='collections'
            itemType={'collection'}
          />
        </div>
      );
    }

    if (item.type === 'flowtest' && item.name.match(FLOW_FILE_SUFFIX_REGEX)) {
      return (
        <div
          className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out hover:bg-slate-100'
          onClick={() => {
            readFlowTest(item.pathname, collectionId)
              .then((result) => {
                console.log(
                  `Read flowtest: name = ${item.name}, path = ${item.pathname}, collectionId = ${collectionId}`,
                );
              })
              .catch((error) => {
                // TODO: show error in UI
                console.log(`Error reading flowtest: ${error}`);
              });
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <DocumentIcon className='h-4 w-4' />
            <span>{item.name}</span>
          </div>
          <OptionsMenu data-click-from='options-menu' directory={item} data-item-type='file' itemType={'file'} />
        </div>
      );
    }

    if (item.type === 'folder') {
      return (
        <div
          className='flex items-center justify-between gap-2 text-balance rounded p-0 text-start transition duration-200 ease-out hover:bg-slate-100'
          onClick={(event) => {
            const clickFrom = event.target.dataset?.clickFrom;
            if (!clickFrom || clickFrom !== 'options-menu') {
              return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <FolderIcon className='h-4 w-4' />
            <span data-type-name={item.type}>{item.name}</span>
          </div>
          <OptionsMenu data-click-from='options-menu' directory={item} data-item-type='folder' itemType={'folder'} />
        </div>
      );
    }
  };

  return (
    <>
      <li>
        {getListDisplayTitle()}
        {isExpanded && (
          <>
            {item.items?.map((childItem, index) => (
              <ul
                key={index}
                className='before:absolute before:bottom-0 before:top-0 before:w-[1px] before:bg-slate-300 before:opacity-100'
              >
                <Directory collectionId={collectionId} item={childItem} depth={depth + 1} />
              </ul>
            ))}
          </>
        )}
      </li>
    </>
  );
};

export default Directory;
