const { computeNodeVariables, computeVariables } = require('./utils');
const Node = require('./node');
const axios = require('axios');
const chalk = require('chalk');
const { LogLevel } = require('../GraphLogger');

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
    const options = this.formulateRequest(finalUrl, variablesDict);

    console.log(chalk.green(`   ✓ `) + chalk.dim(`type = ${this.nodeData.requestType.toUpperCase()}`));
    console.log(chalk.green(`   ✓ `) + chalk.dim(`url = ${finalUrl}`));

    const res = await this.runHttpRequest(options);

    if (res.error) {
      console.log(chalk.red(`   ✕ `) + chalk.dim(`Request failed: ${JSON.stringify(res.error)}`));
      this.logger.add(LogLevel.ERROR, 'HTTP request failed', {
        type: 'requestNode',
        data: { request: { type: options.method, url: options.url }, response: res.error, preReqVars: evalVariables },
      });
      return {
        status: 'Failed',
      };
    } else {
      console.log(chalk.green(`   ✓ `) + chalk.dim(`Request successful: ${JSON.stringify(res)}`));
      if (this.nodeData.postRespVars) {
        const evalPostRespVars = computeNodeVariables(this.nodeData.postRespVars, res.data);
        this.logger.add(LogLevel.INFO, 'HTTP request success', {
          type: 'requestNode',
          data: {
            request: { type: options.method, url: options.url, data: options.data },
            response: res,
            preReqVars: evalVariables,
            postRespVars: evalPostRespVars,
          },
        });
        return {
          status: 'Success',
          data: res.data,
          postRespVars: evalPostRespVars,
        };
      }
      this.logger.add(LogLevel.INFO, 'HTTP request success', {
        type: 'requestNode',
        data: { request: { type: options.method, url: options.url }, response: res, preReqVars: evalVariables },
      });
      return {
        status: 'Success',
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
        headers: result.headers,
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
        return {
          error: {
            message: `An error occurred while running the request : ${error?.message}`,
          },
        };
      }
    }
  }
}

module.exports = requestNode;
