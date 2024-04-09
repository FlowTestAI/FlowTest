import React, { useState } from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
import registerMainEventHandlers from 'ipc/collection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCommonStore from 'stores/CommonStore';
import LoadingSpinner from 'components/atoms/common/LoadingSpinner';
import HomeLoadingScreen from 'components/atoms/common/HomeLoadingScreen';

const Home = () => {
  const showLoader = useCommonStore((state) => state.showLoader);
  registerMainEventHandlers();
  const [showHomeLoadingScreen, setShowHomeLoadingScreen] = useState(true);
  return (
    <div className='relative flex flex-col h-full'>
      <>
        <MainHeader />
        <SplitPane />
        <MainFooter />
        <ToastContainer position='bottom-left' />
      </>
      {showLoader ? <LoadingSpinner spinnerColor={'text-cyan-950'} /> : ''}
      {setTimeout(() => {
        setShowHomeLoadingScreen(false);
      }, 2000)}
      {showHomeLoadingScreen ? <HomeLoadingScreen /> : ''}
    </div>
  );
};

export default Home;
