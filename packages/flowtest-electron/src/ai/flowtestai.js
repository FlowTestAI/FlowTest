const BedrockClaudeGenerate = require('./models/bedrock_claude');
const OpenAIGenerate = require('./models/openai');

class FlowtestAI {
  async generate(collection, user_instruction, model) {
    if (model.name === 'OPENAI') {
      const available_functions = await this.get_available_functions(collection);
      const openai = new OpenAIGenerate();
      const functions = await openai.filter_functions(available_functions, user_instruction, model.apiKey);
      return await openai.process_user_instruction(functions, user_instruction, model.apiKey);
    } else if (model.name === 'BEDROCK_CLAUDE') {
      const available_functions = await this.get_available_functions(collection);
      const bedrock_claude = new BedrockClaudeGenerate(model.apiKey);
      const functions = await bedrock_claude.filter_functions(available_functions, user_instruction);
      return await bedrock_claude.process_user_instruction(functions, user_instruction);
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
