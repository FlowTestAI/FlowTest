import React, { useState } from 'react';
import Directory from 'components/molecules/workspaceDirectory/Directory';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';
import NewLabelModal from '../modals/workspaceDirectory/NewLabelModal';
import { deleteCollection, deleteFolder, deleteFlowTest } from 'service/collection';

const Directories = ({ directoriesData }) => {
  const [newLabelModalOpen, setNewLabelModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  const handleDeleteMenuItem = (menuItemType, path, collectionId) => {
    if (menuItemType === 'collection') {
      deleteCollection(collectionId)
        .then((result) => {
          console.log(`Deleted collection: collectionId = ${collectionId} \n`);
        })
        .catch((error) => {
          // TODO: show error in UI
          console.log(`Error deleting collection = ${collectionId}: ${error}`);
        });
    }

    if (menuItemType === 'folder') {
      deleteFolder(path, collectionId)
        .then((result) => {
          console.log(`Deleted folder: path = ${path}, collectionId = ${collectionId} \n`);
        })
        .catch((error) => {
          // TODO: show error in UI
          console.log(`Error deleting folder = ${path}: ${error}`);
        });
    }

    if (menuItemType === 'file') {
      console.log(`\n DELETING file :: selectedPathName : ${path} :: selectedCollectionId : ${collectionId} \n`);
      deleteFlowTest(path, collectionId);
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

          setSelectedPathName(pathName);
          setSelectedCollectionId(directoriesData[0].id);
          setSelectedMenuItem(optionsMenuItem);

          switch (optionsMenuItem) {
            case DirectoryOptionsActions.addNewFolder.value:
              setNewLabelModal(true);
              break;
            case DirectoryOptionsActions.addNewFlow.value:
              setNewLabelModal(true);
              break;
            case DirectoryOptionsActions.delete.value:
              handleDeleteMenuItem(itemType, pathName, directoriesData[0].id);
              break;
            default:
              // need to return an error here
              console.log(`DEFAULT OPTION`);
          }
        }
      }}
    >
      <ul className='menu w-full'>
        {directoriesData.map((directory) => (
          <Directory key={directory.id} directory={directory} depth={1} />
        ))}
      </ul>
      <NewLabelModal
        closeFn={() => setNewLabelModal(false)}
        open={newLabelModalOpen}
        pathName={selectedPathName}
        collectionId={selectedCollectionId}
        menuOption={selectedMenuItem}
      />
    </div>
  );
};

export default Directories;
