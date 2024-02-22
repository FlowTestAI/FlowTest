import React from 'react';
import {
  response_1,
  response_2,
  response_3,
  response_4,
  response_5,
} from 'newUserInterface/constants/forTesting/socketResponses';
import EmptyDirectory from './EmptyDirectory';
import Directories from './Directories';

const WorkspaceDirectories = () => {
  /**
   * For now I am getting the static test data for mocking the functionality and test the UI
   * but in future {directoriesData} will be updated in the State by the socket update which is WIP
   */
  const responses = [response_1, response_2, response_3, response_4, response_5];
  const max = 4;
  const min = 0;
  const getRandomIndex = () => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomIndex = getRandomIndex();
  let responseData = responses[randomIndex];
  // uncomment following line to how Empty directory component will be rendered
  // responseData = 0;

  return <>{responseData ? <Directories directoriesData={[responseData]} /> : <EmptyDirectory />}</>;
};

export default WorkspaceDirectories;
