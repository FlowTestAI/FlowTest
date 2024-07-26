import { cloneDeep } from 'lodash';
import { computeNodeVariables, computeVariables } from '../compute/utils';
import { LogLevel } from '../GraphLogger';
import Node from './node';

class requestNode extends Node {
  constructor(nodeData, prevNodeOutputData, envVariables, auth, logger, collectionPath) {
    super('requestNode');
    this.nodeData = nodeData;
    this.prevNodeOutputData = prevNodeOutputData;
    this.envVariables = envVariables;
    this.auth = auth;
    this.logger = logger;
    this.collectionPath = collectionPath;
  }

  async evaluate() {
    console.log('Evaluating request node');
    // step1 evaluate pre request variables of this node
    const evalVariables = computeNodeVariables(this.nodeData.preReqVars, this.prevNodeOutputData);

    const variablesDict = {
      ...this.envVariables,
      ...evalVariables,
    };
    console.debug('Avialable variables: ', variablesDict);

    // step2 replace variables in url with value
    const finalUrl = computeVariables(this.nodeData.url, variablesDict);
    console.debug('Evaluated Url: ', finalUrl);

    // step 3
    const rawRequest = await this.formulateRequest(finalUrl, variablesDict);

    const { request, response } = await this.runHttpRequest(rawRequest);

    if (response.error) {
      this.logger.add(LogLevel.ERROR, 'HTTP request failed', {
        type: 'requestNode',
        data: {
          request,
          response: response.error,
          preReqVars: evalVariables,
        },
      });
      return {
        status: 'Failed',
      };
    } else {
      if (this.nodeData.postRespVars) {
        const evalPostRespVars = computeNodeVariables(this.nodeData.postRespVars, response.data);
        this.logger.add(LogLevel.INFO, 'HTTP request success', {
          type: 'requestNode',
          data: {
            request,
            response,
            preReqVars: evalVariables,
            postRespVars: evalPostRespVars,
          },
        });
        return {
          status: 'Success',
          data: response.data,
          postRespVars: evalPostRespVars,
        };
      }
      this.logger.add(LogLevel.INFO, 'HTTP request success', {
        type: 'requestNode',
        data: {
          request,
          response,
          preReqVars: evalVariables,
        },
      });
      return {
        status: 'Success',
        data: response.data,
      };
    }
  }

  async formulateRequest(finalUrl, variablesDict) {
    let restMethod = this.nodeData.requestType.toLowerCase();
    let headers = {};
    let requestData = undefined;

    if (this.nodeData.requestBody) {
      if (this.nodeData.requestBody.type === 'raw-json') {
        headers['content-type'] = 'application/json';
        requestData = this.nodeData.requestBody.body
          ? JSON.parse(computeVariables(this.nodeData.requestBody.body, variablesDict))
          : JSON.parse('{}');
      } else if (this.nodeData.requestBody.type === 'form-data') {
        headers['content-type'] = 'multipart/form-data';
        const params = cloneDeep(this.nodeData.requestBody.body);
        requestData = params;
      }
    }

    if (this.nodeData.headers && this.nodeData.headers.length > 0) {
      this.nodeData.headers.map((pair, index) => {
        headers[computeVariables(pair.name, variablesDict)] = computeVariables(pair.value, variablesDict);
      });
    }

    if (this.auth && this.auth?.type === 'bearer-token') {
      headers['Authorization'] = `Bearer ${this.auth.token}`;
    }

    const options = {
      method: restMethod,
      url: finalUrl,
      headers,
      data: requestData,
    };

    if (this.auth && this.auth?.type === 'basic-auth') {
      options.auth = {};
      options.auth.username = this.auth.username;
      options.auth.password = this.auth.password;
    }

    return options;
  }

  runHttpRequest(rawRequest) {
    const { ipcRenderer } = window;

    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:run-http-request', rawRequest, this.collectionPath).then(resolve).catch(reject);
    });
  }
}

export default requestNode;
