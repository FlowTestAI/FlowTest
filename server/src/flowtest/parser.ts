export function flowDataToReadableData(flowData) {
    const nodes = flowData.nodes;
    const edges = flowData.edges;

    const readableData = {};
    readableData["nodes"] = [];
    readableData["metadata"] = {};
    readableData["metadata"]["nodes"] = [];
    readableData["metadata"]["edges"] = edges;
    
    nodes.forEach((node) => {
        if (node.data) {
            readableData["nodes"].push({
                id: node.id,
                data: node.data
            });
            delete node.data;
            readableData["metadata"]["nodes"].push(node);
        } else {
            readableData["nodes"].push({
                id: node.id,
                type: node.type
            });
            readableData["metadata"]["nodes"].push(node);
        }
    })

    return readableData;
}

export function readableDataToFlowData(readableData) {

    const nodeData = readableData.nodes;
    const nodeMetadata = readableData.metadata.nodes;
    const edges = readableData.metadata.edges;

    const flowData = {};
    flowData["nodes"] = [];
    flowData["edges"] = edges;

    nodeData.forEach((nData, index) => {
        flowData["nodes"].push({
            ...nData,
            ...nodeMetadata[index]
        })
    })

    return flowData;
}