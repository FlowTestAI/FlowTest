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
    Object.entries(collection['paths']).map(([path, operation], _) => {
      Object.entries(operation).map(([requestType, request], _) => {
        const summary = request['summary'];
        const operationId = request['operationId'];
        const tags = request['tags'];
        var url = replaceSingleToDoubleCurlyBraces(computeUrl(baseUrl, path));
        var variables = {};
        var requestBody = {};
        const pathParameters = [];
        const queryParameters = [];

        if (request['parameters']) {
          let firstQueryParam = true;
          request['parameters'].map((value, _) => {
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
