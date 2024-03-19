import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArchiveBoxIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { OBJ_TYPES } from 'constants/Common';
import { deleteEnvironmentFile } from 'service/collection';
import EnvOptionsMenu from 'components/atoms/sidebar/environments/EnvOptionsMenu';

const Environment = ({ collectionId, collection }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <li>
        <div
          className='flex items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded text-balance text-start hover:bg-slate-100'
          onClick={(event) => {
            const clickFromElementDataSet = event.target.dataset;
            const clickFrom = clickFromElementDataSet?.clickFrom;
            if (!clickFrom || clickFrom !== 'env-options-menu') {
              return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <ArchiveBoxIcon className='w-4 h-4' />
            <span>{collection.name}</span>
          </div>
          <EnvOptionsMenu
            data-click-from='env-options-menu'
            itemType={OBJ_TYPES.environment}
            pathName={collection.pathname}
          />
        </div>
        {isExpanded && (
          <>
            {collection.environments?.map((environment, index) => (
              <ul
                key={index}
                className='before:absolute before:bottom-0 before:top-0 before:w-[1px] before:bg-slate-300 before:opacity-100'
              >
                <li>
                  <div className='flex flex-row items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded text-balance text-start hover:bg-slate-100'>
                    <div className='flex items-center justify-start gap-2 px-2 py-1 cursor-pointer hover:bg-transparent'>
                      <DocumentIcon className='w-4 h-4' />
                      <span>{environment.name}</span>
                    </div>
                    <div
                      className='relative inline-block p-2 text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
                      onClick={() => {
                        console.log(
                          `Deleting environment: name = ${environment.name}, path = ${environment.pathname}, collectionId = ${collectionId}`,
                        );
                        deleteEnvironmentFile(environment.pathname, collectionId)
                          .then((result) => {
                            console.log(
                              `Deleted environment: name = ${environment.name}, path = ${environment.pathname}, collectionId = ${collectionId}, result: ${result}`,
                            );
                          })
                          .catch((error) => {
                            // TODO: show error in UI
                            console.log(
                              `Error deleting environment:  name = ${environment.name}, path = ${environment.pathname}, collectionId = ${collectionId} and error: ${error}`,
                            );
                          });
                      }}
                    >
                      <TrashIcon className='w-4 h-4' aria-hidden='true' />
                    </div>
                  </div>
                </li>
              </ul>
            ))}
          </>
        )}
      </li>
    </>
  );
};

Environment.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
};

export default Environment;
