import React from 'react';
import WorkspaceHeader from 'components/molecules/headers/WorkspaceHeader';
import WorkspaceContent from 'components/molecules/workspace/WorkspaceContent';

const Workspace = () => {
  return (
    <div className='tw-flex tw-h-full tw-flex-col'>
      <WorkspaceHeader />
      <WorkspaceContent />
    </div>
  );
};

export default Workspace;
