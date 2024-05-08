import React from 'react';
import WorkspaceHeader from 'components/molecules/headers/WorkspaceHeader';
import WorkspaceContent from 'components/molecules/workspace/WorkspaceContent';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';

const Workspace = () => {
  return (
    <div className='flex flex-col h-full'>
      <WorkspaceHeader />
      <HorizontalDivider />
      <WorkspaceContent />
    </div>
  );
};

export default Workspace;
