import SwaggerParser from '@apidevtools/swagger-parser';
import JsonRefs from 'json-refs'

class FlowtestAI {
    async generate(user_instruction: string) {
        await this.get_available_functions()
    }

    async get_available_functions() {
        let api = await SwaggerParser.validate('tests/test.yaml');
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);
        const resolvedSpec = (await JsonRefs.resolveRefs(api)).resolved;

        let functions = []
        Object.entries(resolvedSpec["paths"]).map(([path, methods], index) => {
            Object.entries(methods).map(([method, spec], index1) => {
                const function_name = spec["operationId"];

                const desc = spec["description"] || spec["summary"] || "";

                let schema = {"type": "object", "properties": {}};

                let req_body = undefined
                if (spec["requestBody"]){
                    if(spec["requestBody"]["content"]) {
                        if(spec["requestBody"]["content"]["application/json"]) {
                            if(spec["requestBody"]["content"]["application/json"]["schema"]) {
                                req_body = spec["requestBody"]["content"]["application/json"]["schema"]
                            }
                        }
                    }
                }

                if (req_body != undefined) {
                    schema["properties"]["requestBody"] = req_body;
                }

                const params = spec["parameters"] ? spec["parameters"] : [];
                const param_properties = {}
                if (params.length > 0) {
                    for (const param of params) {
                        if (param["schema"]) {
                            param_properties[param["name"]] = param["schema"];
                        }
                    }
                    schema["properties"]["parameters"] = {
                        "type" : "object",
                        "properties": param_properties
                    }
                }

                functions.push(
                    {"name": function_name, "description": desc, "parameters": schema}
                )

                console.log(JSON.stringify(functions));
            })
        })
    }
}

export default FlowtestAI;