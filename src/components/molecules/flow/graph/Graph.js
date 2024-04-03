// assumption is that apis are giving json as output

import { cloneDeep } from 'lodash';
import useCanvasStore from 'stores/CanvasStore';
import useCollectionStore from 'stores/CollectionStore';
import { useTabStore } from 'stores/TabStore';
import { computeAuthNode } from './compute/authnode';
import { computeEvaluateNode } from './compute/evaluatenode';
import { computeRequestNode } from './compute/requestnode';

class Graph {
  constructor(nodes, edges, collectionId, onGraphComplete) {
    const activeEnv = useCollectionStore
      .getState()
      .collections.find((c) => c.id === collectionId)
      ?.environments.find((e) => e.name === useTabStore.getState().selectedEnv);
    this.nodes = nodes;
    this.edges = edges;
    this.onGraphComplete = onGraphComplete;
    this.logs = [];
    this.timeout = 60000; // 1m timeout
    this.startTime = Date.now();
    this.graphRunNodeOutput = {};
    this.auth = undefined;
    this.envVariables = activeEnv ? cloneDeep(activeEnv.variables) : undefined;
  }

  #checkTimeout() {
    return Date.now() - this.startTime > this.timeout;
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
        useCanvasStore.getState().setOutputNode(node.id, prevNodeOutputData);
        result = ['Success', node, prevNodeOutput];
      }

      if (node.type === 'evaluateNode') {
        if (computeEvaluateNode(node, prevNodeOutputData, this.logs)) {
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
        this.auth = node.data.type ? computeAuthNode(node.data, this.envVariables) : undefined;
        result = ['Success', node, prevNodeOutput];
      }

      if (node.type === 'requestNode') {
        result = await computeRequestNode(node, prevNodeOutputData, this.envVariables, this.auth, this.logs);
        // add post response variables if any
        if (result[3]) {
          this.envVariables = {
            ...this.envVariables,
            ...result[3],
          };
        }
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
        useCanvasStore.getState().unSetOutputNode(node.id);
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
        console.log(this.logs);
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
