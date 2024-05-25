const computeUrl = (baseUrl, path) => {
  if (baseUrl.charAt(baseUrl.length - 1) === '/' && path.charAt(0) === '/') {
    return baseUrl + path.substring(1, path.length);
  } else if (baseUrl.charAt(baseUrl.length - 1) !== '/' && path.charAt(0) !== '/') {
    return baseUrl + '/' + path;
  } else {
    return baseUrl + path;
  }
};

const replaceSingleToDoubleCurlyBraces = (str) => {
  // Replace opening curly braces
  str = str.replace(/{/g, '{{');
  // Replace closing curly braces
  str = str.replace(/}/g, '}}');
  return str;
};

const generateExample = (schema) => {
  if (!schema) return {};

  if (schema.enum) {
    return schema.example || schema.enum[0];
  }

  if (schema.oneOf) {
    return generateExample(schema.oneOf[0]);
  }

  if (schema.anyOf) {
    return generateExample(schema.anyOf[0]);
  }

  if (schema.allOf) {
    return generateAllOfExample(schema.allOf);
  }

  switch (schema.type) {
    case 'object':
      return generateObjectExample(schema);
    case 'array':
      return generateArrayExample(schema);
    case 'string':
      return generateStringExample(schema);
    case 'integer':
      return generateIntegerExample(schema);
    case 'number':
      return generateNumberExample(schema);
    case 'boolean':
      return schema.example || true;
    default:
      return schema.example || null;
  }
};

const generateAllOfExample = (schemas) => {
  const example = {};
  schemas.forEach((subSchema) => {
    const subExample = generateExample(subSchema);
    Object.assign(example, subExample);
  });
  return example;
};

const generateObjectExample = (schema) => {
  const example = {};
  const properties = schema.properties || {};

  for (const [key, propertySchema] of Object.entries(properties)) {
    example[key] = generateExample(propertySchema);
  }

  return example;
};

const generateArrayExample = (schema) => {
  const itemsSchema = schema.items || {};
  return [generateExample(itemsSchema)];
};

const generateStringExample = (schema) => {
  let example = schema.example || 'string';

  if (schema.minLength || schema.maxLength) {
    example = generateStringWithLengthConstraints(example, schema.minLength, schema.maxLength);
  }

  switch (schema.format) {
    case 'date-time':
      return schema.example || new Date().toISOString();
    case 'date':
      return schema.example || new Date().toISOString().split('T')[0];
    case 'email':
      return schema.example || 'example@example.com';
    case 'uuid':
      return schema.example || '123e4567-e89b-12d3-a456-426614174000';
    case 'uri':
      return schema.example || 'https://example.com';
    case 'hostname':
      return schema.example || 'example.com';
    case 'ipv4':
      return schema.example || '192.168.0.1';
    case 'ipv6':
      return schema.example || '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    case 'byte':
      return schema.example || btoa('example');
    case 'binary':
      return schema.example || 'binary data';
    case 'password':
      return schema.example || 'password';
    default:
      return example;
  }
};

const generateStringWithLengthConstraints = (str, minLength, maxLength) => {
  if (minLength) {
    while (str.length < minLength) {
      str += 'a';
    }
  }
  if (maxLength) {
    str = str.substring(0, maxLength);
  }
  return str;
};

const generateIntegerExample = (schema) => {
  const min = schema.minimum || 0;
  const max = schema.maximum || min + 100;
  return schema.example || Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateNumberExample = (schema) => {
  const min = schema.minimum || 0.0;
  const max = schema.maximum || min + 100.0;
  return schema.example || Math.random() * (max - min) + min;
};

const parseOpenAPISpec = (collection) => {
  let parsedNodes = [];
  try {
    // servers is array,, figure case where there can be multiple servers
    const baseUrl = collection['servers'][0]['url'];
    Object.entries(collection['paths']).map(([path, operation], _) => {
      Object.entries(operation).map(([requestType, request], _) => {
        const summary = request['summary'];
        const operationId = request['operationId'];
        const tags = request['tags'];
        var url = replaceSingleToDoubleCurlyBraces(computeUrl(baseUrl, path));
        var variables = {};
        var requestBody = {};

        if (request['parameters']) {
          let firstQueryParam = true;
          request['parameters'].map((value, _) => {
            // path parameters are included in url
            // handle multiple parameters
            // allow different type of variables in request node like string, int, array etc...
            if (value['in'] === 'query') {
              if (firstQueryParam) {
                url = url.concat(`?${value['name']}={{${value['name']}}}`);
                firstQueryParam = false;
              } else {
                url = url.concat(`&${value['name']}={{${value['name']}}}`);
              }
            }
          });
        }

        if (request['requestBody']) {
          if (request['requestBody']['content']['application/json']) {
            requestBody = {
              type: 'raw-json',
              body: JSON.stringify(generateExample(request['requestBody']['content']['application/json']['schema'])),
            };
          }

          if (request['requestBody']['content']['multipart/form-data']) {
            requestBody = {
              type: 'form-data',
              body: {
                key: '',
                value: '',
                name: '',
              },
            };
          }
        }

        const finalNode = {
          url: url,
          description: summary,
          operationId: operationId,
          requestType: requestType.toUpperCase(),
          tags: tags,
          requestBody,
        };

        parsedNodes.push(finalNode);
      });
    });
  } catch (err) {
    console.error(err);
  }
  return parsedNodes;
};

module.exports = {
  parseOpenAPISpec,
  generateExample,
};
