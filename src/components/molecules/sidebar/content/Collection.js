import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { ArchiveBoxIcon, FolderIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FLOW_FILE_SUFFIX_REGEX, OBJ_TYPES } from 'constants/Common';
import { readFlowTest } from 'service/collection';
import OptionsMenu from 'components/atoms/sidebar/collections/OptionsMenu';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';
import { deleteFlowTest } from 'service/collection';
import useCollectionStore from 'stores/CollectionStore';

const Collection = ({ collectionId, item, depth }) => {
  //const [isExpanded, setIsExpanded] = useState(false);
  const clickItem = useCollectionStore((state) => state.clickItem);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
  const [flowTestPathToDelete, setFlowTestPathToDelete] = useState('');

  const messageForConfirmActionModal =
    'Do you wish to delete this flowtest? This action deletes it from disk and cannot be undone';

  const getListDisplayTitle = () => {
    if (item.type === OBJ_TYPES.collection) {
      // this is for collections tab thus we have archive box icon
      return (
        <div
          className='flex items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded hover:bg-background-light text-balance text-start'
          onClick={(event) => {
            const clickFromElementDataSet = event.target.dataset;
            const clickFrom = clickFromElementDataSet?.clickFrom;
            if (!clickFrom || clickFrom !== 'options-menu') {
              clickItem(item, collectionId);
              //return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <Tippy content={item.pathname} placement='top'>
            <div className='flex items-center justify-start gap-2 px-2 py-1'>
              <ArchiveBoxIcon className='w-4 h-4' />
              <span>{item.name}</span>
            </div>
          </Tippy>

          <OptionsMenu
            data-click-from='options-menu'
            directory={item}
            data-item-type={OBJ_TYPES.collection}
            itemType={OBJ_TYPES.collection}
            collectionId={collectionId}
          />
        </div>
      );
    }

    if (item.type === OBJ_TYPES.flowtest && item.name.match(FLOW_FILE_SUFFIX_REGEX)) {
      return (
        <div
          className='flex items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded hover:bg-background-light text-balance text-start'
          onClick={() => {
            readFlowTest(item.pathname, collectionId)
              .then((result) => {
                console.log(
                  `Read flowtest: name = ${item.name}, path = ${item.pathname}, collectionId = ${collectionId}, result: ${result}`,
                );
              })
              .catch((error) => {
                console.log(`Error reading flowtest: ${error}`);
                toast.error(`Error reading flowtest`);
              });
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <DocumentIcon className='w-4 h-4' />
            <span>{item.name}</span>
          </div>
          <div
            className='relative inline-block p-2 text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
            onClick={() => {
              setFlowTestPathToDelete(item.pathname);
              setConfirmActionModalOpen(true);
            }}
          >
            <TrashIcon className='w-4 h-4' aria-hidden='true' />
          </div>
        </div>
      );
    }

    if (item.type === OBJ_TYPES.folder) {
      return (
        <div
          className='flex items-center justify-between gap-2 p-0 transition duration-200 ease-out rounded hover:bg-background-light text-balance text-start'
          onClick={(event) => {
            const clickFrom = event.target.dataset?.clickFrom;
            if (!clickFrom || clickFrom !== 'options-menu') {
              clickItem(item, collectionId);
              //return setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div className='flex items-center justify-start gap-2 px-2 py-1'>
            <FolderIcon className='w-4 h-4' />
            <span data-type-name={item.type}>{item.name}</span>
          </div>
          <OptionsMenu
            data-click-from='options-menu'
            directory={item}
            data-item-type={OBJ_TYPES.folder}
            itemType={OBJ_TYPES.folder}
            collectionId={collectionId}
          />
        </div>
      );
    }
  };
  return (
    <>
      <li>
        {getListDisplayTitle()}
        {item.collapsed === false && (
          <>
            {item.items?.map((childItem, index) => (
              <ul
                key={index}
                className='before:background-dark before:absolute before:bottom-0 before:top-0 before:w-[1px] before:opacity-100'
              >
                <Collection collectionId={collectionId} item={childItem} depth={depth + 1} />
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
          deleteFlowTest(flowTestPathToDelete, collectionId)
            .then((result) => {
              console.log(
                `Deleted flowtest: path = ${flowTestPathToDelete}, collectionId = ${collectionId}, result: ${result}`,
              );
            })
            .catch((error) => {
              console.log(`Error deleting flowtest = ${flowTestPathToDelete}: ${error}`);
              toast.error(`Error deleting flowtest`);
            });
          setConfirmActionModalOpen(false);
        }}
      />
    </>
  );
};

Collection.propTypes = {
  collectionId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
};

export default Collection;
