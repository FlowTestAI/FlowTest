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
        var url = replaceSingleToDoubleCurlyBraces(computeUrl(baseUrl, path));
        var variables = {};

        // console.log(operationId)
        // Get is easy, others are hard
        if (requestType.toUpperCase() === 'GET' && request['parameters']) {
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
          if (request['requestBody']['application/json']) {
            // console.log('requestBody: ', request["requestBody"]["content"]["schema"])
            // generate an example to be used in request body
          }
        }

        const finalNode = {
          url: url,
          description: summary,
          operationId: operationId,
          requestType: requestType.toUpperCase(),
        };
        // console.log(finalNode);
        parsedNodes.push(finalNode);
      });
    });
  } catch (err) {
    console.error(err);
  }
  return parsedNodes;
};

module.exports = parseOpenAPISpec;
