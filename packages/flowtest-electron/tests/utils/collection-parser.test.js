const SwaggerParser = require('@apidevtools/swagger-parser');
const JsonRefs = require('json-refs');
const parseOpenAPISpec = require('../../src/utils/collection');

describe('parse', () => {
  it('should add do basic parsing', async () => {
    let api = await SwaggerParser.validate('tests/test.yaml');
    console.log('API name: %s, Version: %s', api.info.title, api.info.version);
    const resolvedSpec = await JsonRefs.resolveRefs(api);
    const nodes = parseOpenAPISpec(resolvedSpec.resolved);
    expect(nodes).toEqual(expected);
  });
});

const expected = [
  {
    url: 'https://petstore3.swagger.io/api/v3/pet',
    description: 'Update an existing pet',
    operationId: 'updatePet',
    requestType: 'PUT',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet',
    description: 'Add a new pet to the store',
    operationId: 'addPet',
    requestType: 'POST',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet/findByStatus?status={status}',
    description: 'Finds Pets by status',
    operationId: 'findPetsByStatus',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet/findByTags?tags={tags}',
    description: 'Finds Pets by tags',
    operationId: 'findPetsByTags',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet/{petId}',
    description: 'Find pet by ID',
    operationId: 'getPetById',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet/{petId}',
    description: 'Updates a pet in the store with form data',
    operationId: 'updatePetWithForm',
    requestType: 'POST',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet/{petId}',
    description: 'Deletes a pet',
    operationId: 'deletePet',
    requestType: 'DELETE',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/pet/{petId}/uploadImage',
    description: 'uploads an image',
    operationId: 'uploadFile',
    requestType: 'POST',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/store/inventory',
    description: 'Returns pet inventories by status',
    operationId: 'getInventory',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/store/order',
    description: 'Place an order for a pet',
    operationId: 'placeOrder',
    requestType: 'POST',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/store/order/{orderId}',
    description: 'Find purchase order by ID',
    operationId: 'getOrderById',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/store/order/{orderId}',
    description: 'Delete purchase order by ID',
    operationId: 'deleteOrder',
    requestType: 'DELETE',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user',
    description: 'Create user',
    operationId: 'createUser',
    requestType: 'POST',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user/createWithList',
    description: 'Creates list of users with given input array',
    operationId: 'createUsersWithListInput',
    requestType: 'POST',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user/login?username={username}?password={password}',
    description: 'Logs user into the system',
    operationId: 'loginUser',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user/logout',
    description: 'Logs out current logged in user session',
    operationId: 'logoutUser',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user/{username}',
    description: 'Get user by user name',
    operationId: 'getUserByName',
    requestType: 'GET',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user/{username}',
    description: 'Update user',
    operationId: 'updateUser',
    requestType: 'PUT',
  },
  {
    url: 'https://petstore3.swagger.io/api/v3/user/{username}',
    description: 'Delete user',
    operationId: 'deleteUser',
    requestType: 'DELETE',
  },
];
