const OpenAI = require('openai');
const dotenv = require('dotenv');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings } = require('@langchain/openai');

//dotenv.config();

const SYSTEM_MESSAGE = `You are a helpful assistant. \ 
        Respond to the following prompt by using function_call and then summarize actions. \ 
        If a user request is ambiguous, choose the best response possible.`;

// Maximum number of function calls allowed to prevent infinite or lengthy loops
const MAX_CALLS = 10;

class FlowtestAI {
  async generate(collection, user_instruction, model) {
    if (model.name === 'OPENAI') {
      const available_functions = await this.get_available_functions(collection);
      const functions = await this.filter_functions(available_functions, user_instruction, model.apiKey);
      return await this.process_user_instruction(functions, user_instruction, model.apiKey);
    } else {
      throw Error(`Model ${model.name} not supported`);
    }
  }

  async get_available_functions(collection) {
    let functions = [];
    Object.entries(collection['paths']).map(([path, methods], index) => {
      Object.entries(methods).map(([method, spec], index1) => {
        const function_name = spec['operationId'];

        const desc = spec['description'] || spec['summary'] || '';

        let schema = { type: 'object', properties: {} };

        let req_body = undefined;
        if (spec['requestBody']) {
          if (spec['requestBody']['content']) {
            if (spec['requestBody']['content']['application/json']) {
              if (spec['requestBody']['content']['application/json']['schema']) {
                req_body = spec['requestBody']['content']['application/json']['schema'];
              }
            }
          }
        }

        if (req_body != undefined) {
          schema['properties']['requestBody'] = req_body;
        }

        const params = spec['parameters'] ? spec['parameters'] : [];
        const param_properties = {};
        if (params.length > 0) {
          for (const param of params) {
            if (param['schema']) {
              param_properties[param['name']] = param['schema'];
            }
          }
          schema['properties']['parameters'] = {
            type: 'object',
            properties: param_properties,
          };
        }

        const f = {
          type: 'function',
          function: { name: function_name, description: desc, parameters: schema },
        };

        if (this.isCyclic(f)) {
          functions.push({
            type: 'function',
            function: { name: function_name, description: desc, parameters: {} },
          });
        } else {
          functions.push(f);
        }
      });
    });

    return functions;
  }

  async filter_functions(functions, instruction, apiKey) {
    const documents = functions.map((f) => {
      const { parameters, ...fDescription } = f.function;
      return JSON.stringify(fDescription);
    });

    const vectorStore = await MemoryVectorStore.fromTexts(
      documents,
      [],
      new OpenAIEmbeddings({
        openAIApiKey: apiKey,
      }),
    );

    // 128 (max no of functions accepted by openAI function calling)
    const retrievedDocuments = await vectorStore.similaritySearch(instruction, 10);
    var selectedFunctions = [];
    retrievedDocuments.forEach((document) => {
      const pDocument = JSON.parse(document.pageContent);
      const findF = functions.find(
        (f) => f.function.name === pDocument.name && f.function.description === pDocument.description,
      );
      if (findF) {
        selectedFunctions = selectedFunctions.concat(findF);
      }
    });

    return selectedFunctions;
  }

  async get_openai_response(functions, messages, apiKey) {
    const openai = new OpenAI({
      apiKey,
    });

    return await openai.chat.completions.create({
      model: 'gpt-4', //gpt-3.5-turbo-16k-0613
      tools: functions,
      tool_choice: 'auto', // "auto" means the model can pick between generating a message or calling a function.
      temperature: 0,
      messages: messages,
    });
  }

  async process_user_instruction(functions, instruction, apiKey) {
    //console.log(functions.map((f) => f.function.name));
    let result = [];
    let num_calls = 0;
    const messages = [
      { content: SYSTEM_MESSAGE, role: 'system' },
      { content: instruction, role: 'user' },
    ];

    while (num_calls < MAX_CALLS) {
      const response = await this.get_openai_response(functions, messages, apiKey);
      const message = response['choices'][0]['message'];

      if (message.tool_calls) {
        messages.push(message);
        message.tool_calls.map((tool_call) => {
          console.log('Function call #: ', num_calls + 1);
          console.log(JSON.stringify(tool_call));

          // We'll simply add a message to simulate successful function call.
          messages.push({
            role: 'tool',
            content: 'success',
            tool_call_id: tool_call.id,
          });
          result.push(tool_call.function);

          num_calls += 1;
        });
      } else {
        console.log('Message: ');
        console.log(message['content']);
        break;
      }
    }

    if (num_calls >= MAX_CALLS) {
      console.log('Reached max chained function calls: ', MAX_CALLS);
    }

    return result;
  }

  isCyclic(obj) {
    var keys = [];
    var stack = [];
    var stackSet = new Set();
    var detected = false;

    function detect(obj, key) {
      if (obj && typeof obj != 'object') {
        return false;
      }

      if (stackSet.has(obj)) {
        // it's cyclic! Print the object and its locations.
        var oldindex = stack.indexOf(obj);
        var l1 = keys.join('.') + '.' + key;
        var l2 = keys.slice(0, oldindex + 1).join('.');
        //console.log('CIRCULAR: ' + l1 + ' = ' + l2 + ' = ' + obj);
        //console.log(obj);
        detected = true;
        return;
      }

      keys.push(key);
      stack.push(obj);
      stackSet.add(obj);
      for (var k in obj) {
        //dive on the object's children
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          detect(obj[k], k);
        }
      }

      keys.pop();
      stack.pop();
      stackSet.delete(obj);
      return;
    }

    detect(obj, 'obj', keys, stack, stackSet, detected);
    return detected;
  }
}

module.exports = FlowtestAI;
