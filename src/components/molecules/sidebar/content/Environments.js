import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Environment from './Environment';
import NewLabelModal from 'components/molecules/modals/sidebar/NewLabelModal';
import { DirectoryOptionsActions } from 'constants/WorkspaceDirectory';

const Environments = ({ collections }) => {
  const [newLabelModalOpen, setNewLabelModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  return (
    <div
      className='h-[87vh] overflow-y-scroll'
      onClick={(event) => {
        const clickFromElementDataSet = event.target.dataset;
        const clickFrom = clickFromElementDataSet?.clickFrom;

        if (clickFrom && clickFrom === 'env-options-menu') {
          // const itemType = clickFromElementDataSet?.itemType;
          const optionsMenuItem = clickFromElementDataSet?.optionsMenuItem;
          const pathName = clickFromElementDataSet?.pathName;
          const collectionId = clickFromElementDataSet?.collectionId;

          setSelectedPathName(pathName);
          setSelectedCollectionId(collectionId);
          setSelectedMenuItem(optionsMenuItem);

          switch (optionsMenuItem) {
            case DirectoryOptionsActions.addNewEnvironment.value:
              setNewLabelModal(true);
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
          <Environment key={collection.id} collectionId={collection.id} collection={collection} />
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

Environments.propTypes = {
  collections: PropTypes.array.isRequired,
};

export default Environments;
