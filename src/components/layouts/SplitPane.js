import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import Workspace from '../organisms/workspace/Workspace';
import AppNavBar from 'components/organisms/appNavBar';
import SideBar from 'components/organisms/SideBar';
// import Tabs from 'components/atoms/Tabs';
import Tabs from 'components/molecules/Tabs';

const SplitPane = () => {
  return (
    <main className='h-full'>
      <Allotment>
        <Allotment.Pane preferredSize={'450px'} minSize={450}>
          <div className='flex text-xs'>
            <AppNavBar />
            <SideBar />
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          {/* <Workspace /> */}
          <Tabs />
        </Allotment.Pane>
      </Allotment>
    </main>
  );
};

export default SplitPane;
