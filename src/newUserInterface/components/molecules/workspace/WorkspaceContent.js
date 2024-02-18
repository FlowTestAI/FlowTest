import React from 'react';
import Flow from 'newUserInterface/components/molecules/flow';
import WorkspaceContentHeader from 'newUserInterface/components/molecules/headers/WorkspaceContentHeader';

const WorkspaceContent = () => {
  return (
    <div className='tw-flex tw-h-full tw-flex-col'>
      <WorkspaceContentHeader />
      <Flow />
    </div>
  );
};

export default WorkspaceContent;
