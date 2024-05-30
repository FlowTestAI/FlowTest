const OpenAI = require('openai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings } = require('@langchain/openai');

const SYSTEM_MESSAGE = `You are a helpful assistant. \ 
        Respond to the following prompt by using function_call and then summarize actions. \ 
        If a user request is ambiguous, choose the best response possible.`;

// Maximum number of function calls allowed to prevent infinite or lengthy loops
const MAX_CALLS = 10;

class OpenAIGenerate {
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
}

module.exports = OpenAIGenerate;
