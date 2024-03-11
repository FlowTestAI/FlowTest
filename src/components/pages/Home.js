import React from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
import registerMainEventHandlers from 'ipc/collection';

const Home = () => {
  registerMainEventHandlers();

  return (
    <div className='flex h-full flex-col'>
      <MainHeader />
      <SplitPane />
      <MainFooter />
    </div>
  );
};

export default Home;
