import React, { useState } from 'react';
import EmptyDirectory from './EmptyDirectory';
import Directories from './Directories';
import useCollectionStore from 'newUserInterface/stores/collections';

const WorkspaceDirectories = () => {
  const collections = useCollectionStore((state) => state.collections);

  return <>{collections.length != 0 ? <Directories directoriesData={collections} /> : <EmptyDirectory />}</>;
};

export default WorkspaceDirectories;
