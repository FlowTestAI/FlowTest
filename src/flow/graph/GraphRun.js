import * as React from 'react';

import axios from 'axios'

const GraphRun = function(nodes, edges) {

    const startNode = nodes.find((node) => node.type === 'startNode')
    const connectingEdge = edges.find((edge) => edge.source === startNode.id)
    const targetNode = nodes.find((node) => node.type === 'requestNode' && node.id === connectingEdge.target)

    console.log(startNode)
    console.log(connectingEdge)
    console.log(targetNode)
}

export default GraphRun;