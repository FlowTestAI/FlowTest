import { computeNodeVariables, computeVariables } from './utils';

const runHttpRequest = (request) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:run-http-request', request).then(resolve).catch(reject);
  });
};

const formulateRequest = (node, finalUrl, variablesDict, auth, logs) => {
  let restMethod = node.data.requestType.toLowerCase();
  let contentType = 'application/json';
  let requestData = undefined;

  if (node.data.requestBody) {
    if (node.data.requestBody.type === 'raw-json') {
      contentType = 'application/json';
      requestData = node.data.requestBody.body
        ? JSON.parse(computeVariables(node.data.requestBody.body, variablesDict))
        : JSON.parse('{}');
    } else if (node.data.requestBody.type === 'form-data') {
      contentType = 'multipart/form-data';
      requestData = {
        key: computeVariables(node.data.requestBody.body.key, variablesDict),
        value: node.data.requestBody.body.value,
        name: node.data.requestBody.body.name,
      };
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

  if (auth && auth.type === 'basic-auth') {
    options.auth = {};
    options.auth.username = auth.username;
    options.auth.password = auth.password;
  }

  logs.push(`${restMethod} ${finalUrl}`);
  return options;
};

export const computeRequestNode = async (node, prevNodeOutputData, envVariables, auth, logs) => {
  // step1 evaluate variables of this node
  const evalVariables = computeNodeVariables(node.data.preReqVars, prevNodeOutputData);

  const variablesDict = {
    ...envVariables,
    ...evalVariables,
  };

  // step2 replace variables in url with value
  const finalUrl = computeVariables(node.data.url, variablesDict);

  // step 3
  const options = formulateRequest(node, finalUrl, variablesDict, auth, logs);

  console.debug('Avialable variables: ', variablesDict);
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
    if (node.data.postRespVars) {
      const evalPostRespVars = computeNodeVariables(node.data.postRespVars, res.data);
      return ['Success', node, res, evalPostRespVars];
    }
    return ['Success', node, res];
  }
};
