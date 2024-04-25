const { computeNodeVariables, computeVariables } = require('./utils');
const Node = require('./node');
const axios = require('axios');

const newAbortSignal = () => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 60000 || 0);

  return abortController.signal;
};

/** web platform: blob. */
const convertBase64ToBlob = async (base64) => {
  const response = await fetch(base64);
  const blob = await response.blob();
  return blob;
};

class requestNode extends Node {
  constructor(nodeData, prevNodeOutputData, envVariables, auth, logs) {
    super('requestNode');
    this.nodeData = nodeData;
    this.prevNodeOutputData = prevNodeOutputData;
    this.envVariables = envVariables;
    this.auth = auth;
    this.logs = logs;
  }

  async evaluate() {
    console.log('Evaluating request node');
    // step1 evaluate pre request variables of this node
    const evalVariables = computeNodeVariables(this.nodeData.preReqVars, this.prevNodeOutputData);

    const variablesDict = {
      ...this.envVariables,
      ...evalVariables,
    };

    // step2 replace variables in url with value
    const finalUrl = computeVariables(this.nodeData.url, variablesDict);

    // step 3
    const options = this.formulateRequest(finalUrl, variablesDict);

    console.debug('Avialable variables: ', variablesDict);
    console.debug('Evaluated Url: ', finalUrl);

    const res = await this.runHttpRequest(options);

    if (res.error) {
      //console.debug('Failure at node: ', node);
      //console.debug('Error encountered: ', JSON.stringify(res.error));
      this.logs.push(`Request failed: ${JSON.stringify(res.error)}`);
      return {
        status: 'Failed',
        //node,
      };
    } else {
      this.logs.push(`Request successful: ${JSON.stringify(res)}`);
      console.debug('Response: ', JSON.stringify(res));
      if (this.nodeData.postRespVars) {
        const evalPostRespVars = computeNodeVariables(this.nodeData.postRespVars, res.data);
        return {
          status: 'Success',
          //node,
          data: res.data,
          postRespVars: evalPostRespVars,
        };
      }
      return {
        status: 'Success',
        //node,
        data: res.data,
      };
    }
  }

  formulateRequest(finalUrl, variablesDict) {
    let restMethod = this.nodeData.requestType.toLowerCase();
    let contentType = 'application/json';
    let requestData = undefined;

    if (this.nodeData.requestBody) {
      if (this.nodeData.requestBody.type === 'raw-json') {
        contentType = 'application/json';
        requestData = this.nodeData.requestBody.body
          ? JSON.parse(computeVariables(this.nodeData.requestBody.body, variablesDict))
          : JSON.parse('{}');
      } else if (this.nodeData.requestBody.type === 'form-data') {
        contentType = 'multipart/form-data';
        requestData = {
          key: computeVariables(this.nodeData.requestBody.body.key, variablesDict),
          value: this.nodeData.requestBody.body.value,
          name: this.nodeData.requestBody.body.name,
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

    if (this.auth && this.auth.type === 'basic-auth') {
      options.auth = {};
      options.auth.username = this.auth.username;
      options.auth.password = this.auth.password;
    }

    this.logs.push(`${restMethod} ${finalUrl}`);
    return options;
  }

  async runHttpRequest(request) {
    try {
      if (request.headers['Content-type'] === 'multipart/form-data') {
        const requestData = new FormData();
        const file = await convertBase64ToBlob(request.data.value);
        requestData.append(request.data.key, file, request.data.name);

        request.data = requestData;
      }

      // assuming 'application/json' type
      const options = {
        ...request,
        signal: newAbortSignal(),
      };

      const result = await axios(options);
      return {
        status: result.status,
        statusText: result.statusText,
        data: result.data,
      };
    } catch (error) {
      if (error?.response) {
        return {
          error: {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          },
        };
      } else {
        console.error(error);
        return {
          error: {
            message: 'An unknown error occurred while running the request',
          },
        };
      }
    }
  }
}

module.exports = requestNode;
