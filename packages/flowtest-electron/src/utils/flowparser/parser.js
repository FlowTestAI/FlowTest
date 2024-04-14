const { cloneDeep } = require('lodash');
const { AuthNode } = require('./AuthNode');
const { ComplexNode } = require('./ComplexNode');
const { DelayNode } = require('./DelayNode');
const { AssertNode } = require('./AssertNode');
const { OutputNode } = require('./OutputNode');
const { RequestNode } = require('./RequestNode');
const { StartNode } = require('./StartNode');
const { SetVarNode } = require('./SetVarNode');

const VERSION = 1;

const deserialize = (flowData) => {
  // we don't want to modify original object
  const flowDataCopy = cloneDeep(flowData);

  const textData = {};
  textData.version = VERSION;
  textData.graph = {};

  if (flowData) {
    if (flowData.nodes) {
      const nodes = flowDataCopy.nodes;
      textData.graph.data = {};
      textData.graph.data.nodes = {};
      textData.graph.metadata = {};
      textData.graph.metadata.nodes = {};

      nodes.forEach((node) => {
        if (node.type === 'startNode') {
          const sNode = new StartNode();
          const result = sNode.deserialize(node);

          textData.graph.data.nodes[result.id] = {
            type: 'startNode',
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'startNode',
            ...result.metadata,
          };
        }

        if (node.type === 'authNode') {
          const aNode = new AuthNode();
          const result = aNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'authNode',
            auth: result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'authNode',
            ...result.metadata,
          };
        }

        if (node.type === 'requestNode') {
          const rNode = new RequestNode();
          const result = rNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'requestNode',
            ...result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'requestNode',
            ...result.metadata,
          };
        }

        if (node.type === 'outputNode') {
          const oNode = new OutputNode();
          const result = oNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'outputNode',
            ...result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'outputNode',
            ...result.metadata,
          };
        }

        if (node.type === 'delayNode') {
          const dNode = new DelayNode();
          const result = dNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'delayNode',
            ...result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'delayNode',
            ...result.metadata,
          };
        }

        if (node.type === 'assertNode') {
          const eNode = new AssertNode();
          const result = eNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'assertNode',
            ...result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'assertNode',
            ...result.metadata,
          };
        }

        if (node.type === 'complexNode') {
          const cNode = new ComplexNode();
          const result = cNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'complexNode',
            ...result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'complexNode',
            ...result.metadata,
          };
        }

        if (node.type === 'setVarNode') {
          const sNode = new SetVarNode();
          const result = sNode.deserialize(node);
          textData.graph.data.nodes[result.id] = {
            type: 'setVarNode',
            ...result.data,
          };

          textData.graph.metadata.nodes[result.id] = {
            type: 'setVarNode',
            ...result.metadata,
          };
        }
      });
    }

    if (flowData.edges) {
      const edges = flowDataCopy.edges;
      textData.graph.data.edges = [];
      textData.graph.metadata.edges = {};

      edges.forEach((edge) => {
        textData.graph.data.edges.push(`${edge.source} -> ${edge.target}`);

        const { ['id']: _, ..._edge } = edge;
        textData.graph.metadata.edges[edge.id] = _edge;
      });
    }
  }

  return textData;
};

const serialize = (textData) => {
  const flowData = {};
  flowData.nodes = [];
  flowData.edges = [];

  // we don't want to modify original object
  const textDataCopy = cloneDeep(textData);
  const version = textDataCopy.version;
  if (version === 1) {
    if (textDataCopy.graph.data) {
      Object.entries(textDataCopy.graph.data.nodes).map(([key, value], index) => {
        const id = key;

        if (value.type === 'startNode') {
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const sNode = new StartNode();
          const result = sNode.serialize(id, undefined, metadata);

          flowData.nodes.push(result);
        }

        if (value.type === 'authNode') {
          const data = value.auth;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const aNode = new AuthNode();
          const result = aNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }

        if (value.type === 'requestNode') {
          const data = value;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const rNode = new RequestNode();
          const result = rNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }

        if (value.type === 'outputNode') {
          const data = value;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const oNode = new OutputNode();
          const result = oNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }

        if (value.type === 'delayNode') {
          const data = value;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const dNode = new DelayNode();
          const result = dNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }

        if (value.type === 'assertNode') {
          const data = value;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const dNode = new AssertNode();
          const result = dNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }

        if (value.type === 'complexNode') {
          const data = value;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const cNode = new ComplexNode();
          const result = cNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }

        if (value.type === 'setVarNode') {
          const data = value;
          const metadata = textDataCopy.graph.metadata.nodes[id];
          const cNode = new SetVarNode();
          const result = cNode.serialize(id, data, metadata);
          flowData.nodes.push(result);
        }
      });

      Object.entries(textDataCopy.graph.metadata.edges).map(([key, value], index) => {
        flowData.edges.push({
          id: key,
          ...value,
        });
      });
    }
  } else {
    throw new Error('Version not recognized');
  }

  return flowData;
};

module.exports = {
  deserialize,
  serialize,
};
