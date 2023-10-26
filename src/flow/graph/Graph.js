import * as React from 'react';

import axios from 'axios'
import Operators from '../../constants/operators';

// assumption is that apis are giving json as output

class Graph {
    constructor(nodes, edges, onGraphComplete) {
        this.nodes = nodes
        this.edges = edges
        this.onGraphComplete = onGraphComplete
    }

    #formulateRequest(node, finalUrl) {
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

        return options;
    }

    #computeNodeVariable(variable, prevNodeOutputData) {
        if (variable.type === 'String') {
            return variable.value;
        }

        if (variable.type === 'Number') {
            return variable.value;
        }

        if (variable.type === 'Bool') {
            return Boolean(variable.value);
        }
        
        if (variable.type === 'Select') {
            if (Object.keys(prevNodeOutputData).length === 0) {
                console.log('Cannot evaluate variables as prevNodeOutput data is empty: ', prevNodeOutputData)
                throw "Error evaluating node variables"
            }
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
            return getVal(prevNodeOutputData, 0);
        }
    }

    #computeNodeVariables(variables, prevNodeOutputData) {
        let evalVariables = {}
        Object.entries(variables).map(([vname, variable], index) => {
            evalVariables[vname] = this.#computeNodeVariable(variable, prevNodeOutputData)
        })
        return evalVariables;
    }

    async #computeRequestNode(node, prevNodeOutput) {
        try {
            // step1 evaluate variables of this node
            const evalVariables = this.#computeNodeVariables(node.data.variables, prevNodeOutput.data);

            // step2 replace variables in url with value
            let finalUrl = node.data.url
            Object.entries(evalVariables).map(([vname, vvalue], index) => {
                finalUrl = finalUrl.replace(`{${vname}}`, vvalue)
            })

            // step 3
            const options = this.#formulateRequest(node, finalUrl);

            console.log('Executing node: ', node)
            console.log('Evaluated variables: ', evalVariables)
            console.log('Evaluated Url: ', finalUrl)
            const res = await axios(options);
            console.log('Response: ', res)
            return ["Success", node, res];
        } catch(error) {
            console.log('Failure at node: ', node)
            console.log('Error encountered: ', error)
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('Response: ', error.request);
            } else if (error.message) {
                // Something happened in setting up the request that triggered an Error
                console.log('Response: ', error.message);
            } else {
                // Something not related to axios request
                console.log('Failure: ', error);
            }
            return ["Failed", node, error];
        }
    }

    #computeEvaluateNode(node, prevNodeOutput) {
        const var1 = this.#computeNodeVariable(node.data.var1, prevNodeOutput.data)
        const var2 = this.#computeNodeVariable(node.data.var2, prevNodeOutput.data)
        console.log(var1)
            console.log(var2)

        const operator = node.data.operator;
        console.log(operator)
        if (operator == Operators.isEqualTo) {
            return var1 === var2
        } else if (operator == Operators.isNotEqualTo) {
            return var1 != var2
        } else if (operator == Operators.isGreaterThan) {
            return var1 > var2
        } else if (operator == Operators.isLessThan) {
            return var1 < var2
        }
    }

    async #computeNode(node, prevNodeOutput) {
        let result = undefined

        // right now we allow a straight sequential graph but
        // once we allow success/failure routes from each requestNode, this will change
        if (node.type === 'outputNode') {
            node.data.setOutput(prevNodeOutput.data);
            // console.log(node)
            result = ["Success", node, prevNodeOutput];
        }

        if (node.type === 'evaluateNode') {
            if (this.#computeEvaluateNode(node, prevNodeOutput)) {
                result = ["Success", node, prevNodeOutput]; 
            } else {
                result = ["Failed", node];
            }
        }

        if (node.type === 'requestNode') {
            result = await this.#computeRequestNode(node, prevNodeOutput)
        }

        if (result[0] == 'Failed') {
            return result;
        } else {
            const connectingEdge = this.edges.find((edge) => edge.source === node.id)

            if (connectingEdge != undefined) {
                const nextNode = this.nodes.find((node) => (node.type === 'requestNode' || node.type === 'outputNode' || node.type === 'evaluateNode') && node.id === connectingEdge.target)
                return this.#computeNode(nextNode, result[2]);
            } else {
                return result;
            }
        }
    }

    run() {
        const startNode = this.nodes.find((node) => node.type === 'startNode')
        const connectingEdge = this.edges.find((edge) => edge.source === startNode.id)

        // only start computing graph if initial node has the connecting edge
        if (connectingEdge != undefined) {
            const firstRequestNode = this.nodes.find((node) => node.type === 'requestNode' && node.id === connectingEdge.target)
            this.#computeNode(firstRequestNode, JSON.parse('{}'))
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