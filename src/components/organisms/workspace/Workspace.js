import React from 'react';
import WorkspaceHeader from 'components/molecules/headers/WorkspaceHeader';
import WorkspaceContent from 'components/molecules/workspace/WorkspaceContent';

const Workspace = () => {
  return (
    <div className='flex flex-col h-full'>
      <WorkspaceHeader />
      {/* <WorkspaceContent /> */}
    </div>
  );
};

export default Workspace;
