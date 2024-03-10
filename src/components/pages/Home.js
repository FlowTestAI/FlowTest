import React, { useState } from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
// import ModalManager from '../molecules/modals/ModalManager';
import registerMainEventHandlers from 'ipc/collection';

const Home = () => {
  registerMainEventHandlers();
  // const [modalOpen, setModal] = useState(false);

  // const closeModal = () => {
  //   setModal('');
  // };

  return (
    <div className='flex flex-col h-full'>
      <MainHeader />
      <SplitPane />
      {/* <ModalManager closeFn={closeModal} modal={modalOpen} /> */}
      <MainFooter />
    </div>
  );
};

export default Home;
