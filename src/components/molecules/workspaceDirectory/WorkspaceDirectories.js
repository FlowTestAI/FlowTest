import React, { useEffect, useState } from 'react';
import EmptyDirectory from './EmptyDirectory';
import Directories from './Directories';
import useCollectionStore from 'stores/CollectionStore';
import { createCollection } from 'service/collection';

const WorkspaceDirectories = () => {
  const collections = useCollectionStore((state) => state.collections);
  const userSelectedDirectory = useCollectionStore((state) => state.userSelectedDirectory);
  const userSelectedYamlFilePath = useCollectionStore((state) => state.userSelectedYamlFilePath);

  useEffect(() => {
    // input is yaml file path and directory path chosen by user
    if (!userSelectedDirectory && !userSelectedYamlFilePath) {
      return;
    }
    createCollection(userSelectedYamlFilePath, userSelectedDirectory);
  }, [userSelectedDirectory, userSelectedYamlFilePath]);

  return <>{collections.length != 0 ? <Directories directoriesData={collections} /> : <EmptyDirectory />} </>;
};

export default WorkspaceDirectories;
