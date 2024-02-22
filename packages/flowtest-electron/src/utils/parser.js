const cloneDeep = require('lodash/cloneDeep');

const flowDataToReadableData = (flowData) => {
  // we don't want to modify original object
  const flowDataCopy = cloneDeep(flowData);

  const nodes = flowDataCopy.nodes;
  const edges = flowDataCopy.edges;

  const readableData = {};
  readableData['nodes'] = [];
  readableData['metadata'] = {};
  readableData['metadata']['nodes'] = [];
  readableData['metadata']['edges'] = edges;

  nodes.forEach((node) => {
    if (node.data) {
      readableData['nodes'].push({
        id: node.id,
        data: node.data,
      });
      delete node.data;
      readableData['metadata']['nodes'].push(node);
    } else {
      readableData['nodes'].push({
        id: node.id,
        type: node.type,
      });
      readableData['metadata']['nodes'].push(node);
    }
  });

  return readableData;
};

const readableDataToFlowData = (readableData) => {
  // we don't want to modify original object
  const readableDataCopy = cloneDeep(readableData);

  const nodeData = readableDataCopy.nodes;
  const nodeMetadata = readableDataCopy.metadata.nodes;
  const edges = readableDataCopy.metadata.edges;

  const flowData = {};
  flowData['nodes'] = [];
  flowData['edges'] = edges;

  nodeData.forEach((nData, index) => {
    flowData['nodes'].push({
      ...nData,
      ...nodeMetadata[index],
    });
  });

  return flowData;
};

module.exports = {
  flowDataToReadableData,
  readableDataToFlowData,
};
