import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import Workspace from '../organisms/workspace/Workspace';
import AppNavBar from 'components/organisms/AppNavBar';

const WithoutSplitPane = () => {
  const sideBarSize = 112;
  return (
    <main className='h-full'>
      <Allotment>
        <Allotment.Pane preferredSize={`${sideBarSize}px`} minSize={sideBarSize} maxSize={sideBarSize}>
          <div className='flex text-xs'>
            <AppNavBar showRightBorder={false} />
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <Workspace />
        </Allotment.Pane>
      </Allotment>
    </main>
  );
};

export default WithoutSplitPane;
