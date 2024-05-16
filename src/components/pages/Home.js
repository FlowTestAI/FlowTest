import React from 'react';
import SplitPane from '../layouts/SplitPane';
import MainHeader from '../molecules/headers/MainHeader';
import MainFooter from '../molecules/footers/MainFooter';
import registerMainEventHandlers from 'ipc/collection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCommonStore from 'stores/CommonStore';
import LoadingSpinner from 'components/atoms/common/LoadingSpinner';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';
import WithoutSplitPane from 'components/layouts/WithoutSplitPane';
import useCollectionStore from 'stores/CollectionStore';

const Home = () => {
  const collections = useCollectionStore((state) => state.collections);
  const showLoader = useCommonStore((state) => state.showLoader);
  registerMainEventHandlers();
  return (
    <div className='relative flex flex-col h-full font-openSans text-cyan-900'>
      <MainHeader />
      <HorizontalDivider />
      {/* For some reason with this condition in SplitPane component, drag feature was not getting enabled thus putting this here 
        and in future we will remove SplitPane dependency from WithoutSplitPane component but it will require significance effort
      */}
      {collections.length ? <SplitPane /> : <WithoutSplitPane />}
      <HorizontalDivider />
      <MainFooter />
      <ToastContainer position='bottom-left' />
      {showLoader ? <LoadingSpinner spinnerColor={'text-cyan-950'} /> : ''}
    </div>
  );
};

export default Home;
