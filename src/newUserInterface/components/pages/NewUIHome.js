import React from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
import registerMainEventHandlers from 'newUserInterface/ipc/collection';

const NewUIHome = () => {
  registerMainEventHandlers();

  return (
    <div className='new-ui-base tw-flex tw-h-full tw-flex-col'>
      <MainHeader />
      <SplitPane />
      <MainFooter />
    </div>
  );
};

export default NewUIHome;
