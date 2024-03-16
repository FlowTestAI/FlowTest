import { computeNodeVariables } from './utils';

const runHttpRequest = (request) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:run-http-request', request).then(resolve).catch(reject);
  });
};

const formulateRequest = (node, finalUrl, auth, logs) => {
  let restMethod = node.data.requestType.toLowerCase();
  let contentType = 'application/json';
  let requestData = undefined;

  if (restMethod === 'get') {
    if (node.data.requestBody) {
      if (node.data.requestBody.type === 'raw-json') {
        contentType = 'application/json';
        requestData = node.data.requestBody.body ? JSON.parse(node.data.requestBody.body) : JSON.parse('{}');
      }
    }
  } else if (restMethod === 'post' || restMethod === 'put') {
    if (node.data.requestBody) {
      if (node.data.requestBody.type === 'form-data') {
        contentType = 'multipart/form-data';
        requestData = {
          key: node.data.requestBody.body.key,
          value: node.data.requestBody.body.value,
          name: node.data.requestBody.body.name,
        };
      } else if (node.data.requestBody.type === 'raw-json') {
        contentType = 'application/json';
        requestData = node.data.requestBody.body ? JSON.parse(node.data.requestBody.body) : JSON.parse('{}');
      }
    }
  }

  const options = {
    method: restMethod,
    url: finalUrl,
    headers: {
      'Content-type': contentType,
    },
    data: requestData,
  };

  if (auth.type === 'basic-auth') {
    options.auth = {};
    options.auth.username = auth.username;
    options.auth.password = auth.password;
  }

  logs.push(`${restMethod} ${finalUrl}`);
  return options;
};

export const computeRequestNode = async (node, prevNodeOutputData, auth, logs) => {
  // step1 evaluate variables of this node
  const evalVariables = computeNodeVariables(node.data.variables, prevNodeOutputData);

  // step2 replace variables in url with value
  let finalUrl = node.data.url;
  Object.entries(evalVariables).map(([vname, vvalue], index) => {
    finalUrl = finalUrl.replace(`{{${vname}}}`, vvalue);
  });

  // step 3
  const options = formulateRequest(node, finalUrl, auth, logs);

  console.debug('Evaluated variables: ', evalVariables);
  console.debug('Evaluated Url: ', finalUrl);

  const res = await runHttpRequest(options);

  if (res.error) {
    console.debug('Failure at node: ', node);
    console.debug('Error encountered: ', JSON.stringify(res.error));
    logs.push(`Request failed: ${JSON.stringify(res.error)}`);
    return ['Failed', node, res.error];
  } else {
    logs.push(`Request successful: ${JSON.stringify(res)}`);
    console.debug('Response: ', JSON.stringify(res));
    return ['Success', node, res];
  }
};
