import * as React from 'react';

import axios from 'axios'

// assumption is that apis are giving json as output

class Graph {
    constructor(nodes, edges, onGraphComplete) {
        this.nodes = nodes
        this.edges = edges
        this.onGraphComplete = onGraphComplete
    }

    async #evaluateNode(node, prevNodeOutput) {
        // right now we allow a straight sequential graph but
        // once we allow success/failure routes from each requestNode, this will change
        if (node.data.type === 'outputNode') {
            node.data.setOutput(prevNodeOutput);
            // console.log(node)
            return ["Success"];
        }

        // step1 evaluate variables of this node
        let evalVariables = {}
        Object.entries(node.data.variables).map(([vname, variable], index) => {
            if (variable.type === 'String') {
                evalVariables[vname] = variable.value
            } 
            
            if (variable.type === 'Select') {
                const jsonTree = variable.value.split(".")
                function getVal(parent, pos) {
                    if (pos == jsonTree.length) {
                        return parent;
                    }
                    const key = jsonTree[pos]
                    if (key == '') {
                        return parent;
                    }
                    
                    return getVal(parent[key], pos + 1);
                }
                if (Object.keys(prevNodeOutput).length === 0) {
                    console.log('Cannot evaluate variables as prevNodeOutput is empty: ', prevNodeOutput)
                    return ["Failed", node];
                }
                evalVariables[vname] = getVal(prevNodeOutput, 0)
            }
        })

        // step2 replace variables in url with value
        let finalUrl = node.data.url
        Object.entries(evalVariables).map(([vname, vvalue], index) => {
            finalUrl = finalUrl.replace(`{${vname}}`, vvalue)
        })

        let options = undefined
        let restMethod = node.data.requestType.toLowerCase()
        let contentType = 'application/json'
        let requestData = undefined

        if (restMethod ==='get') {
            if (node.data.requestBody) {
                if (node.data.requestBody.type === 'raw-json') {
                    contentType = 'application/json'
                    requestData =  node.data.requestBody.body ? JSON.parse(node.data.requestBody.body) : JSON.parse('{}')
                }
            }

            options = {
                method: 'get',
                url: finalUrl,
                headers: {
                    'Content-type': contentType
                },
                data: requestData
            }

        } else if (restMethod === 'post' || restMethod === 'put') {
            if (node.data.requestBody) {
                if (node.data.requestBody.type === 'form-data') {
                    contentType = 'multipart/form-data'
                    requestData = new FormData();
                    requestData.append(node.data.requestBody.body.key, node.data.requestBody.body.value, node.data.requestBody.body.name)
                } else if (node.data.requestBody.type === 'raw-json') {
                    contentType = 'application/json'
                    requestData =  node.data.requestBody.body ? JSON.parse(node.data.requestBody.body) : JSON.parse('{}')
                }
            } 

            options = {
                method: 'post',
                url: finalUrl,
                headers: {
                    'Content-type': contentType
                },
                data: requestData
            }
        }

        console.log('Executing node: ', node)
        console.log('Evaluated variables: ', evalVariables)
        console.log('Evaluated Url: ', finalUrl)
        let res = undefined;
        try {
            res = await axios(options);
            console.log('Response: ', res)
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Response: ')
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('Response: ', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Response: ', error.message);
            }
            return ["Failed", node];
        }

        const connectingEdge = this.edges.find((edge) => edge.source === node.id)

        if (connectingEdge != undefined) {
            const nextNode = this.nodes.find((node) => (node.type === 'requestNode' || node.type === 'outputNode') && node.id === connectingEdge.target)
            return this.#evaluateNode(nextNode, res.data);
        } else {
            return ["Success"];
        }
    }

    run() {
        const startNode = this.nodes.find((node) => node.type === 'startNode')
        const connectingEdge = this.edges.find((edge) => edge.source === startNode.id)

        // only start computing graph if initial node has the connecting edge
        if (connectingEdge != undefined) {
            const firstRequestNode = this.nodes.find((node) => node.type === 'requestNode' && node.id === connectingEdge.target)
            this.#evaluateNode(firstRequestNode, JSON.parse('{}'))
                .then(result => {
                    if (result[0] == "Failed") {
                        console.log('Flow failed at: ', result[1])
                    }
                    this.onGraphComplete(result);
                });
        } else {
            console.log("No connected request node to start node")
        }
    }
}

export default Graph;