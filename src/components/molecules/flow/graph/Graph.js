import Operators from '../constants/operators.js';

// assumption is that apis are giving json as output

class Graph {
  constructor(nodes, edges, onGraphComplete) {
    this.nodes = nodes;
    this.edges = edges;
    this.onGraphComplete = onGraphComplete;
    this.logs = [];
    this.timeout = 60000; // 1m timeout
    this.startTime = Date.now();
    this.graphRunNodeOutput = {};
    this.auth = undefined;
  }

  #checkTimeout() {
    return Date.now() - this.startTime > this.timeout;
  }

  #formulateRequest(node, finalUrl) {
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

    if (this.auth.type === 'basic-auth') {
      options.auth = {};
      options.auth.username = this.auth.username;
      options.auth.password = this.auth.password;
    }

    this.logs.push(`${restMethod} ${finalUrl}`);
    return options;
  }

  #computeNodeVariable(variable, prevNodeOutputData) {
    if (variable.type.toLowerCase() === 'string') {
      return variable.value;
    }

    if (variable.type.toLowerCase() === 'number') {
      return variable.value;
    }

    if (variable.type.toLowerCase() === 'bool') {
      return Boolean(variable.value);
    }

    if (variable.type.toLowerCase() === 'select') {
      if (prevNodeOutputData == undefined || Object.keys(prevNodeOutputData).length === 0) {
        this.logs.push(
          `Cannot evaluate variable ${variable} as previous node output data ${JSON.stringify(prevNodeOutputData)} is empty`,
        );
        throw 'Error evaluating node variables';
      }
      const jsonTree = variable.value.split('.');
      const getVal = (parent, pos) => {
        if (pos == jsonTree.length) {
          return parent;
        }
        const key = jsonTree[pos];
        if (key == '') {
          return parent;
        }

        return getVal(parent[key], pos + 1);
      };
      const result = getVal(prevNodeOutputData, 0);
      if (result == undefined) {
        this.logs.push(
          `Cannot evaluate variable ${JSON.stringify(variable)} as previous node output data ${JSON.stringify(prevNodeOutputData)} did not contain the variable`,
        );
        throw 'Error evaluating node variables';
      }
      return result;
    }
  }

  #computeNodeVariables(variables, prevNodeOutputData) {
    let evalVariables = {};
    Object.entries(variables).map(([vname, variable], index) => {
      evalVariables[vname] = this.#computeNodeVariable(variable, prevNodeOutputData);
    });
    return evalVariables;
  }

  #runHttpRequest(request) {
    const { ipcRenderer } = window;

    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('renderer:run-http-request', request).then(resolve).catch(reject);
    });
  }

  async #computeRequestNode(node, prevNodeOutputData) {
    // step1 evaluate variables of this node
    const evalVariables = this.#computeNodeVariables(node.data.variables, prevNodeOutputData);

    // step2 replace variables in url with value
    let finalUrl = node.data.url;
    Object.entries(evalVariables).map(([vname, vvalue], index) => {
      finalUrl = finalUrl.replace(`{${vname}}`, vvalue);
    });

    // step 3
    const options = this.#formulateRequest(node, finalUrl);

    console.debug('Evaluated variables: ', evalVariables);
    console.debug('Evaluated Url: ', finalUrl);

    const res = await this.#runHttpRequest(options);

    if (res.error) {
      console.debug('Failure at node: ', node);
      console.debug('Error encountered: ', JSON.stringify(res.error));
      this.logs.push(`Request failed: ${JSON.stringify(res.error)}`);
      return ['Failed', node, res.error];
    } else {
      this.logs.push(`Request successful: ${JSON.stringify(res)}`);
      console.debug('Response: ', JSON.stringify(res));
      return ['Success', node, res];
    }
  }

  #computeEvaluateNode(node, prevNodeOutputData) {
    const evalVariables = this.#computeNodeVariables(node.data.variables, prevNodeOutputData);
    const var1 = evalVariables.var1;
    const var2 = evalVariables.var2;

    const operator = node.data.operator;
    if (operator == undefined) {
      throw 'Operator undefined';
    }
    this.logs.push(
      `Evaluate var1: ${JSON.stringify(var1)} of type: ${typeof var1}, var2: ${JSON.stringify(var2)} of type: ${typeof var2} with operator: ${operator}`,
    );
    if (operator == Operators.isEqualTo) {
      return var1 === var2;
    } else if (operator == Operators.isNotEqualTo) {
      return var1 != var2;
    } else if (operator == Operators.isGreaterThan) {
      return var1 > var2;
    } else if (operator == Operators.isLessThan) {
      return var1 < var2;
    }
  }

  #computeConnectingEdge(node, result) {
    let connectingEdge = undefined;

    if (node.type === 'evaluateNode') {
      if (result[3] === true) {
        connectingEdge = this.edges.find((edge) => edge.sourceHandle == 'true' && edge.source === node.id);
      } else {
        connectingEdge = this.edges.find((edge) => edge.sourceHandle == 'false' && edge.source === node.id);
      }
    } else {
      if (result[0] === 'Success') {
        connectingEdge = this.edges.find((edge) => edge.source === node.id);
      }
    }

    return connectingEdge;
  }

  #computeDataFromPreviousNodes(node) {
    var prevNodesData = {};
    // a request node is allowed multiple incoming edges
    this.edges.forEach((edge) => {
      if (edge.target === node.id) {
        if (this.graphRunNodeOutput[edge.source]) {
          prevNodesData = {
            ...prevNodesData,
            ...this.graphRunNodeOutput[edge.source],
          };
        }
      }
    });
    return prevNodesData;
  }

  async #computeNode(node, prevNodeOutput) {
    let result = undefined;
    const prevNodeOutputData = this.#computeDataFromPreviousNodes(node);

    try {
      console.debug('Executing node: ', node);

      if (node.type === 'outputNode') {
        this.logs.push(`Output: ${JSON.stringify(prevNodeOutputData)}`);
        node.data.setOutput(prevNodeOutputData);
        result = ['Success', node, prevNodeOutput];
      }

      if (node.type === 'evaluateNode') {
        if (this.#computeEvaluateNode(node, prevNodeOutputData)) {
          this.logs.push('Result: true');
          result = ['Success', node, prevNodeOutput, true];
        } else {
          this.logs.push('Result: false');
          result = ['Success', node, prevNodeOutput, false];
        }
      }

      if (node.type === 'delayNode') {
        const delay = node.data.delay;
        const wait = (ms) => {
          return new Promise((resolve) => setTimeout(resolve, Math.min(ms, this.timeout)));
        };
        await wait(delay);
        this.logs.push(`Wait for: ${delay} ms`);
        result = ['Success', node, prevNodeOutput];
      }

      if (node.type === 'authNode') {
        this.auth = node.data.auth;
        result = ['Success', node, prevNodeOutput];
      }

      if (node.type === 'requestNode') {
        result = await this.#computeRequestNode(node, prevNodeOutputData);
      }

      if (this.#checkTimeout()) {
        throw `Timeout of ${this.timeout} ms exceeded, stopping graph run`;
      }
    } catch (err) {
      this.logs.push(`Flow failed at: ${JSON.stringify(node)} due to ${err}`);
      return ['Failed', node];
    }

    if (result === undefined) {
      this.logs.push(`Flow failed at: ${JSON.stringify(node)}`);
      return ['Failed', node];
    } else {
      const connectingEdge = this.#computeConnectingEdge(node, result);

      if (connectingEdge != undefined) {
        const nextNode = this.nodes.find(
          (node) =>
            ['requestNode', 'outputNode', 'evaluateNode', 'delayNode', 'authNode'].includes(node.type) &&
            node.id === connectingEdge.target,
        );
        this.graphRunNodeOutput[node.id] = result[2] && result[2].data ? result[2].data : {};
        return this.#computeNode(nextNode, result[2]);
      } else {
        return result;
      }
    }
  }

  run() {
    // reset every output node for a fresh run
    this.nodes.forEach((node) => {
      if (node.type === 'outputNode') {
        node.data.setOutput(undefined);
      }
    });
    this.graphRunNodeOutput = {};

    this.logs.push('Start Flowtest');
    const startNode = this.nodes.find((node) => node.type === 'startNode');
    if (startNode == undefined) {
      this.logs.push('No start node found');
      this.logs.push('End Flowtest');
      return;
    }
    const connectingEdge = this.edges.find((edge) => edge.source === startNode.id);

    // only start computing graph if initial node has the connecting edge
    if (connectingEdge != undefined) {
      const firstNode = this.nodes.find((node) => node.id === connectingEdge.target);
      this.#computeNode(firstNode, undefined).then((result) => {
        if (result[0] == 'Failed') {
          console.debug('Flow failed at: ', result[1]);
        }
        this.logs.push('End Flowtest');
        this.logs.push(`Total time: ${Date.now() - this.startTime} ms`);
        this.onGraphComplete(result, this.logs);
      });
    } else {
      this.logs.push('No connected request node to start node');
      this.logs.push('End Flowtest');
      this.onGraphComplete(['Success'], this.logs);
    }
  }
}

export default Graph;
