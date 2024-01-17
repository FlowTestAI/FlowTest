import SwaggerParser from '@apidevtools/swagger-parser';
import JsonRefs from 'json-refs'
import OpenAI from 'openai';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_MESSAGE = `You are a helpful assistant. \ 
        Respond to the following prompt by using function_call and then summarize actions. \ 
        Ask for clarification if a user request is ambiguous.`

// Maximum number of function calls allowed to prevent infinite or lengthy loops
const MAX_CALLS = 10

class FlowtestAI {

    async generate(collection: string, user_instruction: string): Promise<any[]> {
        const available_functions = await this.get_available_functions(collection);
        const functions = await this.filter_functions(available_functions, user_instruction);
        return await this.process_user_instruction(functions, user_instruction);
    }

    async get_available_functions(collection: string) {
        fs.writeFileSync('uploads/tmp', collection);
        let api = await SwaggerParser.validate('uploads/tmp');
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
            })
        })
        // console.log(JSON.stringify(functions));
        return functions;
    }

    async filter_functions(functions: any[], instruction: string): Promise<any[]> {
        const chunkSize = 32;
        const chunks = [];

        for (let i = 0; i < functions.length; i += chunkSize) {
            const chunk = functions.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        const documents = chunks.map((chunk) => JSON.stringify(chunk));

        const vectorStore = await MemoryVectorStore.fromTexts(
            documents,
            [],
            new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY
            })
        );

        // 32 x 4 = 128 (max no of functions accepted by openAI function calling)
        const retrievedDocuments = await vectorStore.similaritySearch(instruction, 4);
        var selectedFunctions = [];
        retrievedDocuments.forEach((document) => {
            selectedFunctions = selectedFunctions.concat(JSON.parse(document.pageContent));
        })
        
        return selectedFunctions;
    }

    async get_openai_response(functions: any[], messages: any[]) {
        return await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k-0613",
            functions: functions,
            function_call: "auto",  // "auto" means the model can pick between generating a message or calling a function.
            temperature: 0,
            messages: messages,
        });
    }

    async process_user_instruction(functions: any[], instruction: string): Promise<any[]> {
        let result = []
        let num_calls = 0
        const messages: any[] = [
            {"content": SYSTEM_MESSAGE, "role": "system"},
            {"content": instruction, "role": "user"},
        ];

        while (num_calls < MAX_CALLS) {
            const response = await this.get_openai_response(functions, messages)
            // console.log(response)
            const message = response["choices"][0]["message"]

            if (message["function_call"]) {
                console.log('Function call #: ', num_calls + 1)
                console.log(message["function_call"])
                messages.push(message)

                // We'll simply add a message to simulate successful function call.
                messages.push(
                    {
                        "role": "function",
                        "content": "success",
                        "name": message["function_call"]["name"]
                    }
                )
                result.push(message["function_call"])

                num_calls += 1
            } else {
                console.log("Message: ")
                console.log(message["content"])
                break;
            }
        }

        if (num_calls >= MAX_CALLS) {
            console.log('Reached max chained function calls: ', MAX_CALLS)
        }

        return result;
    }
}

export default FlowtestAI;