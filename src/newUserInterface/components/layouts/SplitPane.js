import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import Workspace from '../organisms/workspace/Workspace';
import AppNavBar from 'newUserInterface/components/molecules/appNavBar';
import WorkspaceDirectory from '../organisms/workspaceDirectory/WorkspaceDirectory';

const SplitPane = () => {
  return (
    <main className='tw-h-full'>
      <Allotment>
        <Allotment.Pane preferredSize={'30%'} minSize={600}>
          <div className='tw-flex tw-text-xs'>
            <AppNavBar />
            <Workspace />
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <WorkspaceDirectory />
        </Allotment.Pane>
      </Allotment>
    </main>
  );
};

export default SplitPane;
