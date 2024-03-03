import React from 'react';
import WorkspaceDirectoryHeader from 'components/molecules/headers/WorkspaceDirectoryHeader';
import WorkspaceDirectories from 'components/molecules/workspaceDirectory/WorkspaceDirectories';

const WorkspaceDirectory = () => {
  return (
    <div className='tw-flex-auto'>
      <WorkspaceDirectoryHeader />
      <WorkspaceDirectories />
    </div>
  );
};

export default WorkspaceDirectory;
