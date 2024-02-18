import React from 'react';
import WorkspaceHeader from 'newUserInterface/components/molecules/headers/WorkspaceHeader';
import WorkspaceContent from 'newUserInterface/components/molecules/workspace/WorkspaceContent';

const Workspace = () => {
  return (
    <div className='tw-flex tw-h-full tw-flex-col'>
      <WorkspaceHeader />
      <WorkspaceContent />
    </div>
  );
};

export default Workspace;
