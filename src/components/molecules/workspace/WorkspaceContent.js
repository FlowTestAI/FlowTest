import React from 'react';
import Flow from 'components/molecules/flow';
import WorkspaceContentHeader from 'components/molecules/headers/WorkspaceContentHeader';

const WorkspaceContent = () => {
  return (
    <div className='tw-flex tw-h-full tw-flex-col'>
      <WorkspaceContentHeader />
      <Flow />
    </div>
  );
};

export default WorkspaceContent;
