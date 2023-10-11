import * as React from 'react';

import axios from 'axios'

const GraphRun = function(nodes, edges) {

    function startRun(node, prevNodeOutput) {

    }

    const startNode = nodes.find((node) => node.type === 'startNode')
    const connectingEdge = edges.find((edge) => edge.source === startNode.id)
    const firstRequestNode = nodes.find((node) => node.type === 'requestNode' && node.id === connectingEdge.target)

    startNode(firstRequestNode, '{}')
}

export default GraphRun;