const { flowDataToReadableData, readableDataToFlowData } = require('../../src/utils/parser');

describe('FlowTest parser', () => {
  it('should parse correctly', async () => {
    const flowData = {
      nodes: [
        {
          width: 150,
          height: 54,
          id: '0',
          type: 'startNode',
          position: { x: 150, y: 150 },
          deletable: false,
          positionAbsolute: { x: 150, y: 150 },
        },
        {
          width: 322,
          height: 415,
          id: '1',
          type: 'requestNode',
          position: { x: 650, y: 50 },
          data: {
            url: 'https://petstore3.swagger.io/api/v3/pet',
            description: 'Add a new pet to the store',
            operationId: 'addPet',
            requestType: 'POST',
            requestBody: {
              type: 'raw-json',
              body: '{"id":1,"name":"Max","category":{"id":1,"name":"Dog"},"photoUrls":["https://example.com/max.jpg"],"tags":[{"id":1,"name":"friendly"}],"status":"available"}',
            },
            type: 'requestNode',
            variables: {},
          },
          positionAbsolute: { x: 650, y: 50 },
        },
        {
          width: 322,
          height: 323,
          id: '2',
          type: 'requestNode',
          position: { x: 1150, y: 50 },
          data: {
            url: 'https://petstore3.swagger.io/api/v3/pet/findByStatus?status={status}',
            description: 'Finds Pets by status',
            operationId: 'findPetsByStatus',
            requestType: 'GET',
            variables: { status: { type: 'string', value: 'available' } },
            type: 'requestNode',
          },
          positionAbsolute: { x: 1150, y: 50 },
        },
        {
          width: 322,
          height: 386,
          id: '3',
          type: 'requestNode',
          position: { x: 1650, y: 50 },
          data: {
            url: 'https://petstore3.swagger.io/api/v3/pet/{petId}',
            description: 'Deletes a pet',
            operationId: 'deletePet',
            requestType: 'DELETE',
            variables: { api_key: { type: 'string', value: 'abc123' }, petId: { type: 'number', value: 1 } },
            type: 'requestNode',
          },
          positionAbsolute: { x: 1650, y: 50 },
        },
      ],
      edges: [
        {
          id: 'reactflow__edge-0-1',
          source: '0',
          sourceHandle: null,
          target: '1',
          targetHandle: null,
          type: 'buttonedge',
          animated: false,
        },
        {
          id: 'reactflow__edge-1-2',
          source: '1',
          sourceHandle: null,
          target: '2',
          targetHandle: null,
          type: 'buttonedge',
          animated: false,
        },
        {
          id: 'reactflow__edge-2-3',
          source: '2',
          sourceHandle: null,
          target: '3',
          targetHandle: null,
          type: 'buttonedge',
          animated: false,
        },
      ],
      viewport: { x: -36.764744037521154, y: 283.77128031134623, zoom: 0.6241892026743837 },
    };

    const readableData = flowDataToReadableData(flowData);
    const result = readableDataToFlowData(readableData);

    expect(result.nodes).toEqual(flowData.nodes);
    expect(result.edges).toEqual(flowData.edges);
  });
});
