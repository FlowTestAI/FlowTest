import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArchiveBoxIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { OBJ_TYPES } from 'constants/Common';
import { deleteEnvironmentFile, readEnvironmentFile } from 'service/collection';
import EnvOptionsMenu from 'components/atoms/sidebar/environments/EnvOptionsMenu';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import useCollectionStore from 'stores/CollectionStore';

const Environment = ({ collectionId, collection }) => {
  //const [isExpanded, setIsExpanded] = useState(false);
  const clickEnvironments = useCollectionStore((state) => state.clickEnvironments);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
  const [envToDelete, setEnvToDelete] = useState('');

  const messageForConfirmActionModal =
    'Do you wish to delete this environment? This action deletes it from disk and cannot be undone';

  return (
    <>
      <li>
        <div
          className='flex items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded text-balance text-start hover:bg-background-light'
          onClick={(event) => {
            const clickFromElementDataSet = event.target.dataset;
            const clickFrom = clickFromElementDataSet?.clickFrom;
            if (!clickFrom || clickFrom !== 'env-options-menu') {
              //return setIsExpanded((prev) => !prev);
              clickEnvironments(collectionId);
            }
          }}
        >
          <Tippy content={collection.pathname} placement='top'>
            <div className='flex items-center justify-start gap-2 px-2 py-1'>
              <ArchiveBoxIcon className='w-4 h-4' />
              <span>{collection.name}</span>
            </div>
          </Tippy>
          <EnvOptionsMenu
            data-click-from='env-options-menu'
            itemType={OBJ_TYPES.environment}
            pathName={collection.pathname}
            collectionId={collectionId}
          />
        </div>
        {collection.envCollapsed === false && (
          <>
            {collection.environments?.map((environment, index) => (
              <ul
                key={index}
                className='before:absolute before:bottom-0 before:top-0 before:w-[1px] before:bg-background-dark before:opacity-100'
              >
                <li>
                  <div
                    className='flex flex-row items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded text-balance text-start hover:bg-background-light'
                    onClick={() => {
                      try {
                        readEnvironmentFile(environment.name, collectionId);
                      } catch (error) {
                        toast.error(`Error reading environment: ${environment.name}`);
                      }
                    }}
                  >
                    <div className='flex items-center justify-start gap-2 px-2 py-1 cursor-pointer hover:bg-transparent'>
                      <DocumentIcon className='w-4 h-4' />
                      <span>{environment.name}</span>
                    </div>
                    <div
                      className='relative inline-block p-2 text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
                      onClick={() => {
                        setEnvToDelete(environment.name);
                        setConfirmActionModalOpen(true);
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
      <ConfirmActionModal
        closeFn={() => setConfirmActionModalOpen(false)}
        open={confirmActionModalOpen}
        message={messageForConfirmActionModal}
        actionFn={() => {
          deleteEnvironmentFile(envToDelete, collectionId)
            .then((result) => {
              console.log(
                `Deleted environment: name = ${envToDelete}, collectionId = ${collectionId}, result: ${result}`,
              );
            })
            .catch((error) => {
              console.log(
                `Error deleting environment:  name = ${envToDelete}, collectionId = ${collectionId} and error: ${error}`,
              );
              toast.error(`Error deleting environment`);
            });
          setConfirmActionModalOpen(false);
        }}
      />
    </>
  );
};

Environment.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
};

export default Environment;
