// assumption is that apis are giving json as output

import { cloneDeep } from 'lodash';
import { readFlowTestSync } from 'service/collection';
import authNode from './compute/authnode';
import nestedFlowNode from './compute/nestedflownode';
import assertNode from './compute/assertnode';
import requestNode from './compute/requestnode';
import setVarNode from './compute/setvarnode';
import { LogLevel } from './GraphLogger';
import { useTabStore } from 'stores/TabStore';

class Graph {
  constructor(nodes, edges, startTime, initialEnvVars, logger, collectionPath, timeout, tab) {
    this.nodes = nodes;
    this.edges = edges;
    this.logger = logger;
    this.timeout = timeout;
    this.startTime = startTime;
    this.graphRunNodeOutput = {};
    this.auth = undefined;
    this.envVariables = initialEnvVars;
    //this.caller = caller;
    this.collectionPath = collectionPath;
    this.tab = tab;
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
        this.logger.add(LogLevel.INFO, '', { type: 'outputNode', data: { output: prevNodeOutputData } });
        if (this.tab) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              output: prevNodeOutputData,
            },
          };
          useTabStore.getState().updateFlowTestNode(this.tab.id, updatedNode);
        }
        result = {
          status: 'Success',
          data: prevNodeOutputData,
        };
      }

      if (node.type === 'assertNode') {
        const eNode = new assertNode(
          node.data.operator,
          node.data.variables,
          prevNodeOutputData,
          this.envVariables,
          this.logger,
        );
        if (eNode.evaluate()) {
          result = {
            status: 'Success',
            data: prevNodeOutputData,
            output: true,
          };
        } else {
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
        this.logger.add(LogLevel.INFO, '', { type: 'delayNode', data: { delay } });
        result = {
          status: 'Success',
          data: prevNodeOutputData,
        };
      }

      if (node.type === 'authNode') {
        const aNode = new authNode(node.data, this.envVariables, this.logger);
        this.auth = node.data.type ? aNode.evaluate() : undefined;
        result = {
          status: 'Success',
          data: prevNodeOutputData,
        };
      }

      if (node.type === 'requestNode') {
        const rNode = new requestNode(
          node.data,
          prevNodeOutputData,
          this.envVariables,
          this.auth,
          this.logger,
          this.collectionPath,
        );
        result = await rNode.evaluate();
        // add post response variables if any
        if (result.postRespVars) {
          this.envVariables = {
            ...this.envVariables,
            ...result.postRespVars,
          };
        }
      }

      if (node.type === 'flowNode') {
        const flowData = await readFlowTestSync(node.data.relativePath);
        if (flowData) {
          const cNode = new nestedFlowNode(
            cloneDeep(flowData.nodes),
            cloneDeep(flowData.edges),
            this.startTime,
            this.envVariables,
            this.logger,
            //node.type,
            this.collectionPath,
            this.timeout,
          );
          result = await cNode.evaluate();
          this.envVariables = result.envVars;
        } else {
          result = {
            status: 'Success',
            data: prevNodeOutputData,
          };
        }
      }

      if (node.type === 'setVarNode') {
        const sNode = new setVarNode(node.data, prevNodeOutputData, this.envVariables);
        const newVariable = sNode.evaluate();
        if (newVariable != undefined) {
          this.logger.add(LogLevel.INFO, '', {
            type: 'setVarNode',
            data: {
              name: Object.keys(newVariable)[0],
              value: newVariable[Object.keys(newVariable)[0]],
            },
          });
          this.envVariables = {
            ...this.envVariables,
            ...newVariable,
          };
        }
        result = {
          status: 'Success',
          data: prevNodeOutputData,
        };
      }

      if (this.#checkTimeout()) {
        throw Error(`Timeout of ${this.timeout} ms exceeded, stopping graph run`);
      }
    } catch (err) {
      this.logger.add(LogLevel.ERROR, `Flow failed due to ${err}`, {
        type: 'errorNode',
        data: node.data,
      });
      return {
        status: 'Failed',
      };
    }

    if (result === undefined) {
      this.logger.add(LogLevel.ERROR, 'Flow failed due to failure to evaluate result', {
        type: 'errorNode',
        data: node.data,
      });
      return {
        status: 'Failed',
      };
    } else {
      const connectingEdge = this.#computeConnectingEdge(node, result);

      if (connectingEdge != undefined) {
        const nextNode = this.nodes.find(
          (node) =>
            ['requestNode', 'outputNode', 'assertNode', 'delayNode', 'authNode', 'flowNode', 'setVarNode'].includes(
              node.type,
            ) && node.id === connectingEdge.target,
        );
        this.graphRunNodeOutput[node.id] = result.data ? result.data : {};
        return this.#computeNode(nextNode);
      } else {
        return result;
      }
    }
  }

  async run() {
    if (this.tab) {
      const updatedNodes = this.nodes.map((node) => {
        if (node.type === 'outputNode') {
          if (node.data.output) {
            const { ['output']: _, ...data } = node.data;
            node.data = data;
          }
        }

        return node;
      });
      useTabStore.getState().updateFlowTestNodes(this.tab.id, updatedNodes);
    }

    this.graphRunNodeOutput = {};

    this.logger.add(LogLevel.INFO, 'Start Flowtest');
    const startNode = this.nodes.find((node) => node.type === 'startNode');
    if (startNode == undefined) {
      this.logger.add(LogLevel.INFO, 'No start node found');
      this.logger.add(LogLevel.INFO, 'End Flowtest');
      return {
        status: 'Success',
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
      this.logger.add(LogLevel.INFO, 'End Flowtest');
      return {
        status: result.status,
        envVars: this.envVariables,
      };
    } else {
      this.logger.add(LogLevel.INFO, 'End Flowtest');
      return {
        status: 'Success',
        envVars: this.envVariables,
      };
    }
  }
}

export default Graph;
