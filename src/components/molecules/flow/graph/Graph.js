// assumption is that apis are giving json as output

import useCanvasStore from 'stores/CanvasStore';
import { computeAuthNode } from './compute/authnode';
import { computeEvaluateNode } from './compute/evaluatenode';
import { computeRequestNode } from './compute/requestnode';

class Graph {
  constructor(nodes, edges, startTime, initialEnvVars, initialLogs) {
    this.nodes = nodes;
    this.edges = edges;
    this.logs = initialLogs;
    this.timeout = 60000; //ms
    this.startTime = startTime;
    this.graphRunNodeOutput = {};
    this.auth = undefined;
    this.envVariables = initialEnvVars;
  }

  #checkTimeout() {
    return Date.now() - this.startTime > this.timeout;
  }

  #computeConnectingEdge(node, result) {
    let connectingEdge = undefined;

    if (node.type === 'evaluateNode') {
      if (result.output === true) {
        connectingEdge = this.edges.find((edge) => edge.sourceHandle == 'true' && edge.source === node.id);
      } else {
        connectingEdge = this.edges.find((edge) => edge.sourceHandle == 'false' && edge.source === node.id);
      }
    } else {
      if (result.status === 'Success') {
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

  async #computeNode(node) {
    let result = undefined;
    const prevNodeOutputData = this.#computeDataFromPreviousNodes(node);

    try {
      console.debug('Executing node: ', node);

      if (node.type === 'outputNode') {
        this.logs.push(`Output: ${JSON.stringify(prevNodeOutputData)}`);
        useCanvasStore.getState().setOutputNode(node.id, prevNodeOutputData);
        result = {
          status: 'Success',
          node,
        };
      }

      if (node.type === 'evaluateNode') {
        if (computeEvaluateNode(node, prevNodeOutputData, this.logs)) {
          this.logs.push('Result: true');
          result = {
            status: 'Success',
            node,
            output: true,
          };
          //result = ['Success', node, prevNodeOutput, true];
        } else {
          this.logs.push('Result: false');
          result = {
            status: 'Success',
            node,
            output: true,
          };
          //result = ['Success', node, prevNodeOutput, false];
        }
      }

      if (node.type === 'delayNode') {
        const delay = node.data.delay;
        const wait = (ms) => {
          return new Promise((resolve) => setTimeout(resolve, Math.min(ms, this.timeout)));
        };
        await wait(delay);
        this.logs.push(`Wait for: ${delay} ms`);
        result = {
          status: 'Success',
          node,
        };
      }

      if (node.type === 'authNode') {
        this.auth = node.data.type ? computeAuthNode(node.data, this.envVariables) : undefined;
        result = {
          status: 'Success',
          node,
        };
      }

      if (node.type === 'requestNode') {
        result = await computeRequestNode(node, prevNodeOutputData, this.envVariables, this.auth, this.logs);
        // add post response variables if any
        if (result.postRespVars) {
          this.envVariables = {
            ...this.envVariables,
            ...result.postRespVars,
          };
        }
      }

      if (this.#checkTimeout()) {
        throw `Timeout of ${this.timeout} ms exceeded, stopping graph run`;
      }
    } catch (err) {
      this.logs.push(`Flow failed at: ${JSON.stringify(node)} due to ${err}`);
      return {
        status: 'Failed',
        node,
      };
    }

    if (result === undefined) {
      this.logs.push(`Flow failed at: ${JSON.stringify(node)}`);
      return {
        status: 'Failed',
        node,
      };
    } else {
      const connectingEdge = this.#computeConnectingEdge(node, result);

      if (connectingEdge != undefined) {
        const nextNode = this.nodes.find(
          (node) =>
            ['requestNode', 'outputNode', 'evaluateNode', 'delayNode', 'authNode'].includes(node.type) &&
            node.id === connectingEdge.target,
        );
        this.graphRunNodeOutput[node.id] = result.data ? result.data : {};
        return this.#computeNode(nextNode);
      } else {
        return result;
      }
    }
  }

  async run() {
    // reset every output node for a fresh run
    this.nodes.forEach((node) => {
      if (node.type === 'outputNode') {
        useCanvasStore.getState().unSetOutputNode(node.id);
      }
    });
    this.graphRunNodeOutput = {};

    this.logs.push('Start Flowtest');
    const startNode = this.nodes.find((node) => node.type === 'startNode');
    if (startNode == undefined) {
      this.logs.push('No start node found');
      this.logs.push('End Flowtest');
      return {
        status: 'Success',
        logs: this.logs,
        envVars: this.envVariables,
      };
    }
    const connectingEdge = this.edges.find((edge) => edge.source === startNode.id);

    // only start computing graph if initial node has the connecting edge
    if (connectingEdge != undefined) {
      const firstNode = this.nodes.find((node) => node.id === connectingEdge.target);
      const result = await this.#computeNode(firstNode);
      if (result.status == 'Failed') {
        console.debug('Flow failed at: ', result.node);
      }
      this.logs.push('End Flowtest');
      return {
        status: result.status,
        logs: this.logs,
        envVars: this.envVariables,
      };
    } else {
      this.logs.push('End Flowtest');
      return {
        status: 'Success',
        logs: this.logs,
        envVars: this.envVariables,
      };
    }
  }
}

export default Graph;
