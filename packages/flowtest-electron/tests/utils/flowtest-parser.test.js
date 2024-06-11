const { deserialize, serialize } = require('../../src/utils/flowparser/parser');

describe('FlowTest parser', () => {
  it('should parse correctly', async () => {
    const flowData = {
      nodes: [
        {
          id: '0',
          type: 'startNode',
          position: {
            x: 150,
            y: 150,
          },
          deletable: false,
          width: 90,
          height: 60,
        },
        {
          id: '1',
          data: {
            type: 'basic-auth',
            username: '{{accessId}}',
            password: '{{accessKey}}',
          },
          type: 'authNode',
          position: {
            x: 402,
            y: 138,
          },
          deletable: false,
          width: 214,
          height: 199,
          selected: false,
          dragging: false,
          positionAbsolute: {
            x: 402,
            y: 138,
          },
        },
        {
          id: '2',
          data: {
            url: 'https://petstore3.swagger.io/api/v3/pet',
            description: 'Add a new pet to the store',
            operationId: 'addPet',
            requestType: 'POST',
            tags: ['pet'],
            type: 'requestNode',
            requestBody: {
              type: 'raw-json',
              body: '{"id":1,"name":"Max","category":{"id":1,"name":"Dog"},"photoUrls":["https://example.com/max.jpg"],"tags":[{"id":1,"name":"friendly"}],"status":"available"}',
            },
            postRespVars: {
              petId: {
                type: 'Select',
                value: 'id',
              },
            },
          },
          type: 'requestNode',
          position: {
            x: 747.1300785316197,
            y: 71.34121814738344,
          },
          width: 402,
          height: 528,
          selected: false,
          positionAbsolute: {
            x: 747.1300785316197,
            y: 71.34121814738344,
          },
          dragging: false,
        },
        {
          id: '3',
          data: {
            url: 'https://petstore3.swagger.io/api/v3/pet/findByStatus?status={{status}}',
            description: 'Finds Pets by status',
            operationId: 'findPetsByStatus',
            requestType: 'GET',
            tags: ['pet'],
            type: 'requestNode',
            preReqVars: {
              status: {
                type: 'String',
                value: 'available',
              },
            },
          },
          type: 'requestNode',
          position: {
            x: 1217.0371813974814,
            y: 75.76040720254832,
          },
          width: 406,
          height: 392,
          selected: false,
          positionAbsolute: {
            x: 1217.0371813974814,
            y: 75.76040720254832,
          },
          dragging: false,
        },
        {
          id: '8',
          type: 'delayNode',
          position: {
            x: 1671.5283794101285,
            y: 181.3397155683441,
          },
          data: {
            description: 'Add a certain delay before next computation.',
            type: 'delayNode',
            delay: '6',
          },
          width: 214,
          height: 110,
          selected: false,
          positionAbsolute: {
            x: 1671.5283794101285,
            y: 181.3397155683441,
          },
          dragging: false,
        },
        {
          id: '9',
          type: 'assertNode',
          position: {
            x: 1958.6425053074213,
            y: 59.84168648963893,
          },
          data: {
            description: 'Assert on conditional expressions.',
            type: 'assertNode',
            variables: {
              var1: {
                type: 'String',
                value: '1',
              },
              var2: {
                type: 'String',
                value: '1',
              },
            },
            operator: 'isEqualTo',
          },
          width: 296,
          height: 328,
          selected: false,
          positionAbsolute: {
            x: 1958.6425053074213,
            y: 59.84168648963893,
          },
          dragging: false,
        },
        {
          id: '10',
          type: 'flowNode',
          position: {
            x: 2427.6600136878287,
            y: 94.18397266812065,
          },
          data: {
            description: 'Helps to create nested flows',
            type: 'flowNode',
            relativePath: 'sample.flow',
          },
          width: 164,
          height: 108,
          selected: true,
          positionAbsolute: {
            x: 2427.6600136878287,
            y: 94.18397266812065,
          },
          dragging: false,
        },
        {
          id: '11',
          type: 'outputNode',
          position: {
            x: 2366.8251067430897,
            y: 268.8390280901134,
          },
          data: {
            description: 'Displays any data received.',
            type: 'outputNode',
          },
          width: 276,
          height: 386,
          selected: false,
          positionAbsolute: {
            x: 2366.8251067430897,
            y: 268.8390280901134,
          },
          dragging: false,
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
        },
        {
          source: '1',
          sourceHandle: null,
          target: '2',
          targetHandle: null,
          type: 'buttonedge',
          id: 'reactflow__edge-1-2',
        },
        {
          source: '2',
          sourceHandle: null,
          target: '3',
          targetHandle: null,
          type: 'buttonedge',
          id: 'reactflow__edge-2-3',
        },
        {
          source: '3',
          sourceHandle: null,
          target: '8',
          targetHandle: null,
          type: 'buttonedge',
          id: 'reactflow__edge-3-8',
        },
        {
          source: '8',
          sourceHandle: null,
          target: '9',
          targetHandle: null,
          type: 'buttonedge',
          id: 'reactflow__edge-8-9',
        },
        {
          source: '9',
          sourceHandle: 'false',
          target: '11',
          targetHandle: null,
          type: 'buttonedge',
          id: 'reactflow__edge-9false-11',
        },
        {
          source: '9',
          sourceHandle: 'true',
          target: '10',
          targetHandle: null,
          type: 'buttonedge',
          id: 'reactflow__edge-9true-10',
        },
      ],
      viewport: { x: 0.1, y: 0.2, zoom: 1.9876 },
    };

    const textData = deserialize(flowData);
    const _flowData = serialize(textData);
    //console.log(JSON.stringify(textData));
    //console.log(JSON.stringify(_flowData));

    expect(_flowData.nodes).toEqual(flowData.nodes);
    expect(_flowData.edges).toEqual(flowData.edges);
    expect(_flowData.viewport).toEqual(flowData.viewport);
  });
});
