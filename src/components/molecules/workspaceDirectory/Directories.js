import React from 'react';
import Directory from 'components/molecules/workspaceDirectory/Directory';

const Directories = ({ directoriesData }) => {
  return (
    <ul className='tw-list-inside tw-list-none tw-px-2 tw-py-4'>
      {directoriesData.map((directory, index) => (
        <Directory key={index} directory={directory} depth={1} />
      ))}
    </ul>
  );
};

export default Directories;
