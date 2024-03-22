import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { OBJ_TYPES } from 'constants/Common';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';
import { deleteCollection, deleteFolder, deleteFlowTest } from 'service/collection';
import NewLabelModal from 'components/molecules/modals/sidebar/NewLabelModal';
import Collection from './Collection';
import ConfirmActionModal from 'components/molecules/modals/ConfirmActionModal';

const Collections = ({ collections }) => {
  const [newLabelModalOpen, setNewLabelModal] = useState(false);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);

  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');

  const messageForConfirmActionModal =
    selectedItemType === OBJ_TYPES.collection
      ? `Do you wish to remove this collection? This action does not delete from disk so you can open this collection again`
      : `Do you wish to delete this ${selectedItemType}? This action deletes it from disk and cannot be undone`;

  const handleDeleteMenuItem = (menuItemType, path, collectionId) => {
    if (menuItemType === OBJ_TYPES.collection) {
      deleteCollection(collectionId)
        .then((result) => {
          console.log(`Deleted collection: collectionId = ${collectionId}, result: ${result}`);
        })
        .catch((error) => {
          // TODO: show error in UI
          console.log(`Error deleting collection = ${collectionId}: ${error}`);
        });
    }

    if (menuItemType === OBJ_TYPES.folder) {
      deleteFolder(path, collectionId)
        .then((result) => {
          console.log(`Deleted folder: path = ${path}, collectionId = ${collectionId}, result: ${result}`);
        })
        .catch((error) => {
          // TODO: show error in UI
          console.log(`Error deleting folder = ${path}: ${error}`);
        });
    }

    if (menuItemType === OBJ_TYPES.flowtest) {
      deleteFlowTest(path, collectionId)
        .then((result) => {
          console.log(`Deleted flowtest: path = ${path}, collectionId = ${collectionId}, result: ${result}`);
        })
        .catch((error) => {
          // TODO: show error in UI
          console.log(`Error deleting flowtest = ${path}: ${error}`);
        });
    }
  };

  return (
    <div
      onClick={(event) => {
        const clickFromElementDataSet = event.target.dataset;
        const clickFrom = clickFromElementDataSet?.clickFrom;

        if (clickFrom && clickFrom === 'options-menu') {
          const itemType = clickFromElementDataSet?.itemType;
          const optionsMenuItem = clickFromElementDataSet?.optionsMenuItem;
          const pathName = clickFromElementDataSet?.pathName;
          const collectionId = clickFromElementDataSet?.collectionId;

          console.log(clickFromElementDataSet);

          setSelectedPathName(pathName);
          setSelectedCollectionId(collectionId);
          setSelectedMenuItem(optionsMenuItem);

          switch (optionsMenuItem) {
            case DirectoryOptionsActions.addNewFolder.value:
              setNewLabelModal(true);
              break;
            case DirectoryOptionsActions.addNewFlow.value:
              setNewLabelModal(true);
              break;
            case DirectoryOptionsActions.delete.value:
              setSelectedItemType(itemType);
              setConfirmActionModalOpen(true);
              break;
            default:
              // need to return an error here
              console.log(`DEFAULT OPTION`);
          }
        }
      }}
    >
      <ul className='w-full menu'>
        {collections.map((collection) => (
          <Collection key={collection.id} collectionId={collection.id} item={collection} depth={1} />
        ))}
      </ul>
      <NewLabelModal
        closeFn={() => setNewLabelModal(false)}
        open={newLabelModalOpen}
        pathName={selectedPathName}
        collectionId={selectedCollectionId}
        menuOption={selectedMenuItem}
      />
      <ConfirmActionModal
        closeFn={() => setConfirmActionModalOpen(false)}
        open={confirmActionModalOpen}
        message={messageForConfirmActionModal}
        actionFn={() => {
          handleDeleteMenuItem(selectedItemType, selectedPathName, selectedCollectionId);
          setConfirmActionModalOpen(false);
        }}
      />
    </div>
  );
};

Collections.propTypes = {
  collections: PropTypes.array.isRequired,
};

export default Collections;
