const { generateExample } = require('./collection.js');

describe('collection parser', () => {
  it('should generate request body example', () => {
    console.log(JSON.stringify(generateExample(userSchema), null, 2));
    console.log(JSON.stringify(generateExample(productSchema), null, 2));
    console.log(JSON.stringify(generateExample(complexSchema), null, 2));
  });
});

const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      format: 'int64',
      example: 1,
      minimum: 1,
    },
    name: {
      type: 'string',
      example: 'John Doe',
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'john.doe@example.com',
    },
    birthdate: {
      type: 'string',
      format: 'date',
      example: '1990-01-01',
    },
    website: {
      type: 'string',
      format: 'uri',
      example: 'https://johndoe.com',
    },
    role: {
      type: 'string',
      enum: ['admin', 'user', 'guest'],
      example: 'user',
    },
    username: {
      type: 'string',
      pattern: '^[a-zA-Z0-9]{3,}$',
      example: 'user123',
    },
  },
};

const productSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      format: 'int32',
      example: 101,
      minimum: 1,
      maximum: 1000,
    },
    name: {
      type: 'string',
      example: 'Sample Product',
      minLength: 3,
    },
    price: {
      type: 'number',
      format: 'double',
      example: 19.99,
      minimum: 0,
      maximum: 1000,
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        example: 'tag1',
      },
    },
    status: {
      type: 'string',
      enum: ['available', 'out of stock', 'discontinued'],
      example: 'available',
    },
    releaseDate: {
      type: 'string',
      format: 'date-time',
      example: '2023-01-01T00:00:00Z',
    },
  },
};

const complexSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Complex Example',
    },
    detail: {
      oneOf: [
        { type: 'string', example: 'OneOf String' },
        { type: 'integer', example: 42 },
      ],
    },
    options: {
      anyOf: [
        { type: 'boolean', example: true },
        { type: 'string', example: 'AnyOf String' },
      ],
    },
    allDetails: {
      allOf: [
        {
          type: 'object',
          properties: {
            part1: {
              type: 'string',
              example: 'Part 1',
            },
          },
        },
        {
          type: 'object',
          properties: {
            part2: {
              type: 'number',
              example: 123.45,
            },
          },
        },
      ],
    },
  },
};
