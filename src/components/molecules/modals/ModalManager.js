import React from 'react';
import { ModalNames } from 'constants/ModalNames';
import ImportCollectionModal from 'components/molecules/modals/ImportCollectionModal';
import NewCollection from 'components/molecules/modals/create/NewCollection';
import AddVariableModal from 'components/molecules/modals/flow/AddVariableModal';

const ModalManager = ({ closeFn = () => {}, modal = '' }) => {
  return (
    <>
      <ImportCollectionModal closeFn={closeFn} open={modal === ModalNames.IMPORT_COLLECTION_MODAL} />
      <NewCollection closeFn={closeFn} open={modal === ModalNames.CREATE_NEW_COLLECTION_MODAL} />
      <AddVariableModal closeFn={closeFn} open={modal === ModalNames.ADD_VARIABLE_FOR_REQUEST_NODE_MODAL} />
    </>
  );
};

export default ModalManager;
