// assumption is that apis are giving json as output

const { cloneDeep } = require('lodash');
const authNode = require('./compute/authnode');
// const complexNode = require('./compute/complexnode');
const assertNode = require('./compute/assertnode');
const requestNode = require('./compute/requestNode');
const setVarNode = require('./compute/setvarnode');
const chalk = require('chalk');
const path = require('path');
const readFile = require('../../flowtest-electron/src/utils/filemanager/readfile');
const { serialize } = require('../../flowtest-electron/src/utils/flowparser/parser');
const Node = require('./compute/node');

class complexNode extends Node {
  constructor(nodes, edges, startTime, timeout, initialEnvVars, initialLogs) {
    super('complexNode');
    try {
      this.internalGraph = new Graph(nodes, edges, startTime, timeout, initialEnvVars, initialLogs);
    } catch (error) {
      console.log(error);
    }
  }

  async evaluate() {
    //console.log('Evaluating a complex node (nested graph):');
    return this.internalGraph.run();
  }
}

class Graph {
  constructor(nodes, edges, startTime, timeout, initialEnvVars, initialLogs) {
    this.nodes = nodes;
    this.edges = edges;
    this.logs = initialLogs;
    this.timeout = timeout;
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
      //console.debug('Executing node: ', node);

      if (node.type === 'outputNode') {
        //this.logs.push(`Output: ${JSON.stringify(prevNodeOutputData)}`);
        //useCanvasStore.getState().setOutputNode(node.id, prevNodeOutputData);
        console.log('Output Node');
        console.log(chalk.green(`   ✓ `) + chalk.dim(`${JSON.stringify(prevNodeOutputData)}`));
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
          this.logs,
        );
        if (eNode.evaluate()) {
          //this.logs.push('Result: true');
          console.log(chalk.green(`   ✓ `) + chalk.dim('True'));
          result = {
            status: 'Success',
            data: prevNodeOutputData,
            output: true,
          };
        } else {
          //this.logs.push('Result: false');
          console.log(chalk.red(`   ✕ `) + chalk.dim('False'));
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
        console.log('Delay Node: ' + chalk.green(`....waiting for: ${delay} ms`));
        await wait(delay);
        //this.logs.push(`Wait for: ${delay} ms`);
        result = {
          status: 'Success',
        };
      }

      if (node.type === 'authNode') {
        console.log('Authentication Node');
        const aNode = new authNode(node.data, this.envVariables);
        this.auth = node.data.type ? aNode.evaluate() : undefined;
        result = {
          status: 'Success',
        };
      }

      if (node.type === 'requestNode') {
        console.log('Request Node');
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
        console.log('Complex Node (Nested graph)');
        const content = readFile(path.join(process.cwd(), node.data.relativePath));
        const flowData = serialize(JSON.parse(content));
        if (flowData) {
          const cNode = new complexNode(
            cloneDeep(flowData.nodes),
            cloneDeep(flowData.edges),
            this.startTime,
            this.timeout,
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

      if (node.type === 'setVarNode') {
        console.log('Set Variable Node');
        const sNode = new setVarNode(node.data, prevNodeOutputData, this.envVariables);
        const newVariable = sNode.evaluate();
        if (newVariable != undefined) {
          //this.logs.push(`Evaluate variable: ${JSON.stringify(newVariable)}`);
          console.log(chalk.green(`   ✓ `) + chalk.dim(`Evaluate variable: ${JSON.stringify(newVariable)}`));
          this.envVariables = {
            ...this.envVariables,
            ...newVariable,
          };
        }
        result = {
          status: 'Success',
        };
      }

      if (this.#checkTimeout()) {
        console.log(chalk.red(`Timeout of ${this.timeout} ms exceeded, stopping graph run`));
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
            ['requestNode', 'outputNode', 'assertNode', 'delayNode', 'authNode', 'complexNode', 'setVarNode'].includes(
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
    // reset every output node for a fresh run
    // this.nodes.forEach((node) => {
    //   if (node.type === 'outputNode') {
    //     useCanvasStore.getState().unSetOutputNode(node.id);
    //   }
    // });
    this.graphRunNodeOutput = {};

    //this.logs.push('Start Flowtest');
    console.log(chalk.green('Start Flowtest'));
    const startNode = this.nodes.find((node) => node.type === 'startNode');
    if (startNode == undefined) {
      //this.logs.push('No start node found');
      //this.logs.push('End Flowtest');
      console.log(chalk.red(`✕ `) + chalk.red('No start node found'));
      console.log(chalk.red('End Flowtest'));
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
        console.log(chalk.red('End Flowtest'));
      } else {
        console.log(chalk.green('End Flowtest'));
      }
      //this.logs.push('End Flowtest');
      return {
        status: result.status,
        logs: this.logs,
        envVars: this.envVariables,
      };
    } else {
      //this.logs.push('End Flowtest');
      console.log(chalk.green('End Flowtest'));
      return {
        status: 'Success',
        logs: this.logs,
        envVars: this.envVariables,
      };
    }
  }
}

module.exports = { Graph };
