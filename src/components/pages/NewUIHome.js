import React, { useState } from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
import ModalManager from '../molecules/modals/ModalManager';
import registerMainEventHandlers from 'ipc/collection';

const NewUIHome = () => {
  registerMainEventHandlers();

  const [modalOpen, setModal] = useState(false);

  const openModal = (event) => {
    event.preventDefault();
    const {
      target: {
        dataset: { modal },
      },
    } = event;
    if (modal) {
      setModal(modal);
    }
  };

  const closeModal = () => {
    setModal('');
  };
  return (
    <div className='new-ui-base tw-flex tw-h-full tw-flex-col' onClick={openModal}>
      <MainHeader />
      <SplitPane />
      <ModalManager closeFn={closeModal} modal={modalOpen} />
      <MainFooter />
    </div>
  );
};

export default NewUIHome;
