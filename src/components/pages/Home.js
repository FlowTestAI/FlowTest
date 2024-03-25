import React from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
import registerMainEventHandlers from 'ipc/collection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  registerMainEventHandlers();
  return (
    <div className='flex h-full flex-col'>
      <MainHeader />
      <SplitPane />
      <MainFooter />
      <ToastContainer position='bottom-left' />
    </div>
  );
};

export default Home;
