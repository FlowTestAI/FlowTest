// assumption is that apis are giving json as output

import { cloneDeep } from 'lodash';
import { readFlowTestSync } from 'service/collection';
import useCanvasStore from 'stores/CanvasStore';
import authNode from './compute/authnode';
import complexNode from './compute/complexnode';
import assertNode from './compute/assertnode';
import requestNode from './compute/requestNode';

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

    if (node.type === 'assertNode') {
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
          data: prevNodeOutputData,
        };
      }

      if (node.type === 'assertNode') {
        const eNode = new assertNode(node.data.operator, node.data.variables, prevNodeOutputData, this.logs);
        if (eNode.evaluate()) {
          this.logs.push('Result: true');
          result = {
            status: 'Success',
            data: prevNodeOutputData,
            output: true,
          };
        } else {
          this.logs.push('Result: false');
          result = {
            status: 'Success',
            data: prevNodeOutputData,
            output: false,
          };
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
        };
      }

      if (node.type === 'authNode') {
        const aNode = new authNode(node.data, this.envVariables);
        this.auth = node.data.type ? aNode.evaluate() : undefined;
        result = {
          status: 'Success',
        };
      }

      if (node.type === 'requestNode') {
        const rNode = new requestNode(node.data, prevNodeOutputData, this.envVariables, this.auth, this.logs);
        result = await rNode.evaluate();
        // add post response variables if any
        if (result.postRespVars) {
          this.envVariables = {
            ...this.envVariables,
            ...result.postRespVars,
          };
        }
      }

      if (node.type === 'complexNode') {
        const flowData = await readFlowTestSync(node.data.relativePath);
        if (flowData) {
          const cNode = new complexNode(
            cloneDeep(flowData.nodes),
            cloneDeep(flowData.edges),
            this.startTime,
            this.envVariables,
            this.logs,
          );
          result = await cNode.evaluate();
          this.envVariables = result.envVars;
        } else {
          result = {
            status: 'Success',
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
      };
    }

    if (result === undefined) {
      this.logs.push(`Flow failed at: ${JSON.stringify(node)}`);
      return {
        status: 'Failed',
      };
    } else {
      const connectingEdge = this.#computeConnectingEdge(node, result);

      if (connectingEdge != undefined) {
        const nextNode = this.nodes.find(
          (node) =>
            ['requestNode', 'outputNode', 'assertNode', 'delayNode', 'authNode', 'complexNode'].includes(node.type) &&
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
      // if (result.status == 'Failed') {
      //   console.debug('Flow failed at: ', result.node);
      // }
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
