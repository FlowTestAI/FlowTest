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
    console.log(`\n handleDeleteMenuItem \n`);
    if (menuItemType === 'collection') {
      console.log(`\n DELETING collection :: selectedCollectionId : ${collectionId} \n`);
      deleteCollection(collectionId);
    }

    if (menuItemType === 'folder') {
      console.log(`\n DELETING folder :: selectedPathName : ${path} :: selectedCollectionId : ${collectionId} \n`);
      deleteFolder(path, collectionId);
    }

    if (menuItemType === 'file') {
      console.log(`\n DELETING file :: selectedPathName : ${path} :: selectedCollectionId : ${collectionId} \n`);
      deleteFlowTest(path, collectionId);
    }
  };

  return (
    <div
      onClick={(event) => {
        console.log(`\n Directories \n`);
        const clickFromElementDataSet = event.target.dataset;
        const clickFrom = clickFromElementDataSet?.clickFrom;

        if (clickFrom && clickFrom === 'options-menu') {
          console.log(`\n Directories :: options-menu \n`);
          const itemType = clickFromElementDataSet?.itemType;
          const optionsMenuItem = clickFromElementDataSet?.optionsMenuItem;
          const pathName = clickFromElementDataSet?.pathName;

          setSelectedPathName(pathName);
          console.log(`\n Directories :: options-menu :: pathName : ${pathName} \n`);
          setSelectedCollectionId(directoriesData[0].id);
          setSelectedMenuItem(optionsMenuItem);
          console.log(`\n Directories :: options-menu :: optionsMenuItem : ${optionsMenuItem} \n`);

          switch (optionsMenuItem) {
            case DirectoryOptionsActions.addNewFolder.value:
              console.log(`\n NEW_FOLDER \n`);
              setNewLabelModal(true);
              break;
            case DirectoryOptionsActions.addNewFlow.value:
              console.log(`\n NEW_FLOW \n`);
              setNewLabelModal(true);
              break;
            case DirectoryOptionsActions.delete.value:
              console.log(`\n DELETE_FOLDER \n`);
              handleDeleteMenuItem(itemType, pathName, directoriesData[0].id);
              break;
            default:
              console.log(`\n DEFAULT \n`);
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
