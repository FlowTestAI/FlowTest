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
  // const [modalType, setModalType] = useState('folder');

  const handleFileOptionsClick = () => {
    console.log(`\n FILE OPTIONS \n`);
    switch (selectedMenuItem) {
      case DirectoryOptionsActions.addNewFolder.value:
        console.log(`\n NEW_FOLDER \n`);
        setNewLabelModal(true);
        break;
      case DirectoryOptionsActions.addNewFlow.value:
        console.log(`\n NEW_FLOW \n`);
        setNewLabelModal(true);
        break;
      case DirectoryOptionsActions.deleteFolder.value:
        console.log(`\n DELETE_FOLDER \n`);
        deleteFlowTest(selectedPathName, selectedCollectionId);
        break;
      default:
        console.log(`\n DEFAULT \n`);
    }
  };
  const handleFolderOptionsClick = () => {
    console.log(`\n FOLDER OPTIONS \n`);
    switch (selectedMenuItem) {
      case DirectoryOptionsActions.addNewFolder.value:
        console.log(`\n NEW_FOLDER \n`);
        setNewLabelModal(true);
        break;
      case DirectoryOptionsActions.addNewFlow.value:
        console.log(`\n NEW_FLOW \n`);
        setNewLabelModal(true);
        break;
      case DirectoryOptionsActions.deleteFolder.value:
        console.log(`\n DELETE_FOLDER \n`);
        deleteFolder(selectedPathName, selectedCollectionId);
        break;
      default:
        console.log(`\n DEFAULT \n`);
    }
  };
  const handleCollectionsOptionsClick = () => {
    console.log(`\n Collections OPTIONS \n`);
    switch (selectedMenuItem) {
      case DirectoryOptionsActions.addNewFolder.value:
        console.log(`\n NEW_FOLDER \n`);
        setNewLabelModal(true);
        break;
      case DirectoryOptionsActions.addNewFlow.value:
        console.log(`\n NEW_FLOW \n`);
        setNewLabelModal(true);
        break;
      case DirectoryOptionsActions.deleteFolder.value:
        console.log(`\n DELETE_FOLDER \n`);
        deleteCollection(selectedCollectionId);
        break;
      default:
        console.log(`\n DEFAULT \n`);
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
          console.log(`\n itemType :: ${itemType} \n`);
          setSelectedPathName(pathName);
          setSelectedCollectionId(directoriesData[0].id);
          setSelectedMenuItem(optionsMenuItem);

          if (itemType === 'collection') {
            handleFileOptionsClick();
          }

          if (itemType === 'folder') {
            handleFolderOptionsClick();
          }

          if (itemType === 'file') {
            handleCollectionsOptionsClick();
          }
        }
      }}
    >
      <ul className='w-full menu'>
        {directoriesData.map((directory, index) => (
          <Directory key={directory.id} directory={directory} depth={1} />
        ))}
      </ul>
      <NewLabelModal
        closeFn={() => setNewLabelModal(false)}
        open={newLabelModalOpen}
        pathName={selectedPathName}
        collectionId={selectedCollectionId}
        menuOption={selectedMenuItem}
        // modalType={modalType}
      />
    </div>
  );
};

export default Directories;
