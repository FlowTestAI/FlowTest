import * as React from 'react';

import axios from 'axios'

// assumption is that apis are giving json as output
// test string: '{"body":{"explainPlan":"90ms", "tf_runner":{"process":"90ms"}}}'

const GraphRun = function(nodes, edges) {

    function startRun(node, prevNodeOutput) {

        // step1 evaluate variables of this node
        let evalVariables = {}
        Object.entries(node.data.variables).map(([vname, variable], index) => {
            if (variable.type === 'String') {
                evalVariables[vname] = variable.value
            } 
            
            if (variable.type === 'Select') {
                const jsonTree = variable.value.split(".")
                function getVal(parent, pos) {
                    const key = jsonTree[pos]

                    if (jsonTree.length <= 1 || key == '' || Object.keys(prevNodeOutput).length === 0) {
                        return ''
                    }
                    if (pos == jsonTree.length) {
                        return parent;
                    }
                    
                    return getVal(parent[key], pos + 1);
                }
                evalVariables[vname] = getVal(prevNodeOutput, 0)
            }
        })

        // step2 replace variables in url with value
        let finalUrl = node.data.url
        Object.entries(evalVariables).map(([vname, vvalue], index) => {
            finalUrl = finalUrl.replace(`{{${vname}}}`, vvalue)
        })
        console.log(evalVariables)
        console.log(finalUrl)
    }

    const startNode = nodes.find((node) => node.type === 'startNode')
    const connectingEdge = edges.find((edge) => edge.source === startNode.id)

    // only start computing graph if initial node has the connecting edge
    if (connectingEdge != undefined) {
        const firstRequestNode = nodes.find((node) => node.type === 'requestNode' && node.id === connectingEdge.target)
        startRun(firstRequestNode, JSON.parse('{}'))
    }
}

export default GraphRun;