import React from 'react';
import ImportCollectionModal from 'newUserInterface/components/molecules/modals/ImportCollectionModal';
import NewCollection from 'newUserInterface/components/molecules/modals/create/NewCollection';

const ModalManager = ({ closeFn = () => {}, modal = '' }) => {
  return (
    <>
      <ImportCollectionModal closeFn={closeFn} open={modal === 'IMPORT_COLLECTION_MODAL'} />
      <NewCollection closeFn={closeFn} open={modal === 'CREATE_NEW_COLLECTION_MODAL'} />
    </>
  );
};

export default ModalManager;
