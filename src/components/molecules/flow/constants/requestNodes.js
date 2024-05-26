const requestNodes = [
  {
    requestType: 'GET',
    description: 'GET is used to request data from a specified resource.',
    type: 'requestNode',
  },
  {
    requestType: 'POST',
    description: 'POST is used to send data to a server to create/update a resource.',
    type: 'requestNode',
  },
  {
    requestType: 'PUT',
    description: 'PUT is used to send data to a server to create/update a resource. PUT requests are idempotent.',
    type: 'requestNode',
  },
  {
    requestType: 'DELETE',
    description: 'DELETE is used to delete the specified resource.',
    type: 'requestNode',
  },
  {
    requestType: 'PATCH',
    description: 'PATCH is used for making partial changes to an existing resource.',
    type: 'requestNode',
  },
];

export default requestNodes;
