const { computeNodeVariables, computeVariables } = require('./utils');
const Node = require('./node');
const axios = require('axios');
const chalk = require('chalk');
const { LogLevel } = require('../GraphLogger');
const FormData = require('form-data');
const { extend, cloneDeep } = require('lodash');
const fs = require('fs');
const path = require('path');

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
  constructor(nodeData, prevNodeOutputData, envVariables, auth, logger) {
    super('requestNode');
    this.nodeData = nodeData;
    this.prevNodeOutputData = prevNodeOutputData;
    this.envVariables = envVariables;
    this.auth = auth;
    this.logger = logger;
  }

  async evaluate() {
    // step1 evaluate pre request variables of this node
    const evalVariables = computeNodeVariables(this.nodeData.preReqVars, this.prevNodeOutputData);

    const variablesDict = {
      ...this.envVariables,
      ...evalVariables,
    };

    // step2 replace variables in url with value
    const finalUrl = computeVariables(this.nodeData.url, variablesDict);

    // step 3
    const rawRequest = this.formulateRequest(finalUrl, variablesDict);

    console.log(chalk.green(`   ✓ `) + chalk.dim(`type = ${this.nodeData.requestType.toUpperCase()}`));
    console.log(chalk.green(`   ✓ `) + chalk.dim(`url = ${finalUrl}`));

    const { request, response } = await this.runHttpRequest(rawRequest);

    if (response.error) {
      console.log(chalk.red(`   ✕ `) + chalk.dim(`Request failed: ${JSON.stringify(response.error)}`));
      this.logger.add(LogLevel.ERROR, 'HTTP request failed', {
        type: 'requestNode',
        data: {
          request: { type: request.method, url: request.url, data: request.data },
          response: response.error,
          preReqVars: evalVariables,
        },
      });
      return {
        status: 'Failed',
      };
    } else {
      console.log(chalk.green(`   ✓ `) + chalk.dim(`Request successful: ${JSON.stringify(response)}`));
      if (this.nodeData.postRespVars) {
        const evalPostRespVars = computeNodeVariables(this.nodeData.postRespVars, response.data);
        this.logger.add(LogLevel.INFO, 'HTTP request success', {
          type: 'requestNode',
          data: {
            request: { type: request.method, url: request.url, data: request.data },
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
          request: { type: request.method, url: request.url, data: request.data },
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

  formulateRequest(finalUrl, variablesDict) {
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

    const options = {
      method: restMethod,
      url: finalUrl,
      headers,
      data: requestData,
    };

    if (this.auth && this.auth.type === 'basic-auth') {
      options.auth = {};
      options.auth.username = this.auth.username;
      options.auth.password = this.auth.password;
    }

    return options;
  }

  async runHttpRequest(request) {
    let requestSent;
    try {
      if (request.headers['content-type'] === 'multipart/form-data') {
        const formData = new FormData();
        const params = request.data;
        await params.map(async (param, index) => {
          if (param.type === 'text') {
            formData.append(param.key, param.value);
          }

          if (param.type === 'file') {
            let trimmedFilePath = param.value.trim();

            formData.append(param.key, fs.createReadStream(trimmedFilePath), path.basename(trimmedFilePath));
          }
        });

        request.data = formData;
        extend(request.headers, formData.getHeaders());
      }

      requestSent = {
        url: request.url,
        method: request.method,
        headers: request.headers,
        // form data obj gets serialized here so that it can be sent over wire
        // otherwise ipc communication errors out
        data: JSON.parse(JSON.stringify(request.data)),
      };

      const result = await axios({
        ...request,
        signal: newAbortSignal(),
      });

      return {
        request: requestSent,
        response: {
          status: result.status,
          statusText: result.statusText,
          data: result.data,
          headers: result.headers,
        },
      };
    } catch (error) {
      if (error?.response) {
        return {
          request: requestSent,
          response: {
            error: {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
              headers: error.response.headers,
            },
          },
        };
      } else {
        return {
          request: requestSent,
          response: {
            error: {
              status: '',
              statusText: '',
              data: `An error occurred while running the request : ${error?.message}`,
            },
          },
        };
      }
    }
  }
}

module.exports = requestNode;
