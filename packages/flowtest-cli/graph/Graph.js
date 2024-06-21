// assumption is that apis are giving json as output

const { cloneDeep } = require('lodash');
const authNode = require('./compute/authnode');
const assertNode = require('./compute/assertnode');
const requestNode = require('./compute/requestNode');
const setVarNode = require('./compute/setvarnode');
const chalk = require('chalk');
const path = require('path');
const readFile = require('../../flowtest-electron/src/utils/filemanager/readfile');
const { serialize } = require('../../flowtest-electron/src/utils/flowparser/parser');
const Node = require('./compute/node');
const { LogLevel } = require('./GraphLogger');

class nestedFlowNode extends Node {
  constructor(nodes, edges, startTime, timeout, initialEnvVars, logger) {
    super('flowNode');
    try {
      this.internalGraph = new Graph(nodes, edges, startTime, timeout, initialEnvVars, logger);
    } catch (error) {
      console.log(error);
    }
  }

  async evaluate() {
    return this.internalGraph.run();
  }
}

class Graph {
  constructor(nodes, edges, startTime, timeout, initialEnvVars, logger) {
    this.nodes = nodes;
    this.edges = edges;
    this.timeout = timeout;
    this.startTime = startTime;
    this.graphRunNodeOutput = {};
    this.auth = undefined;
    this.envVariables = initialEnvVars;
    this.logger = logger;
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
      if (node.type === 'outputNode') {
        console.log('Output Node');
        console.log(chalk.green(`   ✓ `) + chalk.dim(`${JSON.stringify(prevNodeOutputData)}`));
        this.logger.add(LogLevel.INFO, '', { type: 'outputNode', data: { output: prevNodeOutputData } });
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
          console.log(chalk.green(`   ✓ `) + chalk.dim('True'));
          result = {
            status: 'Success',
            data: prevNodeOutputData,
            output: true,
          };
        } else {
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
        this.logger.add(LogLevel.INFO, '', { type: 'delayNode', data: { delay } });
        result = {
          status: 'Success',
          data: prevNodeOutputData,
        };
      }

      if (node.type === 'authNode') {
        console.log('Authentication Node');
        const aNode = new authNode(node.data, this.envVariables, this.logger);
        this.auth = node.data.type ? aNode.evaluate() : undefined;
        result = {
          status: 'Success',
          data: prevNodeOutputData,
        };
      }

      if (node.type === 'requestNode') {
        console.log('Request Node');
        const rNode = new requestNode(node.data, prevNodeOutputData, this.envVariables, this.auth, this.logger);
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
        console.log('Flow Node (Nested graph)');
        const content = readFile(path.join(process.cwd(), node.data.relativePath));
        const flowData = serialize(JSON.parse(content));
        if (flowData) {
          const cNode = new nestedFlowNode(
            cloneDeep(flowData.nodes),
            cloneDeep(flowData.edges),
            this.startTime,
            this.timeout,
            this.envVariables,
            this.logger,
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
        console.log('Set Variable Node');
        const sNode = new setVarNode(node.data, prevNodeOutputData, this.envVariables);
        const newVariable = sNode.evaluate();
        if (newVariable != undefined) {
          console.log(chalk.green(`   ✓ `) + chalk.dim(`Set variable: ${JSON.stringify(newVariable)}`));
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
      console.log(chalk.red(`Flow failed at: ${JSON.stringify(node.data)} due to ${err}`));
      this.logger.add(LogLevel.ERROR, `Flow failed due to ${err}`, node);
      return {
        status: 'Failed',
      };
    }

    if (result === undefined) {
      console.log(chalk.red(`Flow failed due to failure to evaluate result at node: ${node.data}`));
      this.logger.add(LogLevel.ERROR, 'Flow failed due to failure to evaluate result', node);
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
    this.graphRunNodeOutput = {};

    console.log(chalk.green('Start Flowtest'));
    this.logger.add(LogLevel.INFO, 'Start Flowtest');

    const startNode = this.nodes.find((node) => node.type === 'startNode');
    if (startNode == undefined) {
      console.log(chalk.red(`✕ `) + chalk.red('No start node found'));
      console.log(chalk.red('End Flowtest'));
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
      if (result.status == 'Failed') {
        console.log(chalk.red('End Flowtest'));
      } else {
        console.log(chalk.green('End Flowtest'));
      }
      this.logger.add(LogLevel.INFO, 'End Flowtest');
      return {
        status: result.status,
        envVars: this.envVariables,
      };
    } else {
      console.log(chalk.green('End Flowtest'));
      this.logger.add(LogLevel.INFO, 'End Flowtest');
      return {
        status: 'Success',
        envVars: this.envVariables,
      };
    }
  }
}

module.exports = { Graph };
