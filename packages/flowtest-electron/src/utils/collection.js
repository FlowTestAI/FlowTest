const { generateRequestBodyExample } = require('./generate-request-body');
const {
  generateQueryParamsExample,
  generateParameterExample,
  generatePathParamsExample,
} = require('./generate-request-parameters');

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

const parseOpenAPISpec = (collection) => {
  let parsedNodes = [];
  try {
    // servers is array,, figure case where there can be multiple servers
    const baseUrl = collection['servers'][0]['url'];
    Object.entries(collection['paths']).map(([path, operations], _) => {
      const commonParameters = Object.prototype.hasOwnProperty.call(operations, 'parameters')
        ? operations['parameters']
        : [];
      const { parameters, ...operationsFiltered } = operations;
      Object.entries(operationsFiltered).map(([requestType, request], _) => {
        const summary = request['summary'];
        const operationId = request['operationId'];
        const tags = request['tags'];
        var url = replaceSingleToDoubleCurlyBraces(computeUrl(baseUrl, path));
        var variables = {};
        var requestBody = {};
        const pathParameters = [];
        const queryParameters = [];

        const requestParameters = commonParameters.map((obj) => {
          if (request['parameters']) {
            // Find the object in the second array that has the same id as the current object
            const objFromArr2 = request['parameters'].find((o) => o.name === obj.name && o.in === obj.in);
            // If found, merge the two objects, otherwise return the original object
            return objFromArr2 ? { ...obj, ...objFromArr2 } : obj;
          } else {
            return obj;
          }
        });

        if (request['parameters']) {
          // Add any objects from the second array that do not exist in the first array
          request['parameters'].forEach((obj) => {
            if (!commonParameters.some((o) => o.name === obj.name && o.in === obj.in)) {
              requestParameters.push(obj);
            }
          });
        }

        if (requestParameters.length > 0) {
          let firstQueryParam = true;
          requestParameters.map((value, _) => {
            if (value['in'] === 'query') {
              if (firstQueryParam) {
                url = url.concat(`?${value['name']}={{${value['name']}}}`);
                firstQueryParam = false;
              } else {
                url = url.concat(`&${value['name']}={{${value['name']}}}`);
              }
              queryParameters.push(value);
            }

            if (value['in'] === 'path') {
              pathParameters.push(value);
            }
          });
        }

        if (queryParameters.length > 0) {
          const res = generateQueryParamsExample(queryParameters);
          Array.from(res.entries()).map(([key, value], index) => {
            variables[key] = {
              type: typeof value,
              value,
            };
          });
        }

        if (pathParameters.length > 0) {
          const res = generatePathParamsExample(pathParameters);
          Array.from(res.entries()).map(([key, value], index) => {
            variables[key] = {
              type: typeof value,
              value,
            };
          });
        }

        if (request['requestBody']) {
          if (request['requestBody']['content']['application/json']) {
            requestBody = {
              type: 'raw-json',
              body: JSON.stringify(
                generateRequestBodyExample(request['requestBody']['content']['application/json']['schema']),
              ),
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
          preReqVars: variables,
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
};
