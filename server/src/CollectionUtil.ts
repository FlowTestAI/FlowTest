import SwaggerParser from '@apidevtools/swagger-parser';

class CollectionUtil {

    async parse(collection: object) {
        let parsedNodes = []
        try {
            // servers is array,, figure case where there can be multiple servers
            const baseUrl = collection["servers"][0]["url"]
            Object.entries(collection["paths"]).map(([path, operation], index) => {
                var url = baseUrl + path
                Object.entries(operation).map(([requestType, request], index1) => {
                    const summary = request['summary'];
                    const operationId = request['operationId'];
                    // console.log(operationId)
                    // Get is easy, others are hard
                    if (requestType.toUpperCase() === 'GET' && request["parameters"]) {
                        request["parameters"].map((value, index2) => {
                            // path parameters are included in url
                            // handle multiple parameters
                            // allow different type of variables in request node like string, int, array etc...
                            if (value['in'] === 'query') {
                                url = url.concat(`?${value['name']}={${value['name']}}`);
                            }
                        })
                    }

                    if (request["requestBody"]) {
                        if (request["requestBody"]["application/json"]) {
                            // console.log('requestBody: ', request["requestBody"]["content"]["schema"])
                            // generate an example to be used in request body
                        }
                    }

                    const finalNode = {
                        url: url,
                        description: summary,
                        operationId: operationId,
                        requestType: requestType.toUpperCase()
                    }
                    // console.log(finalNode);
                    parsedNodes.push(finalNode)
                })
            })
        }
            catch(err) {
            console.error(err);
        }
        return parsedNodes;
    }
}

export default CollectionUtil;