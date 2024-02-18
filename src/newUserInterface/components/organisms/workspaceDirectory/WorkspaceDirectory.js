import React from 'react';
import WorkspaceDirectoryHeader from 'newUserInterface/components/molecules/headers/WorkspaceDirectoryHeader';
import WorkspaceDirectories from 'newUserInterface/components/molecules/workspaceDirectory/WorkspaceDirectories';

const WorkspaceDirectory = () => {
  return (
    <div className='tw-flex-auto'>
      <WorkspaceDirectoryHeader />
      <WorkspaceDirectories />
    </div>
  );
};

export default WorkspaceDirectory;
