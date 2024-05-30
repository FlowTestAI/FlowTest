const { BedrockChat } = require('@langchain/community/chat_models/bedrock');
const { HumanMessage, SystemMessage, BaseMessage } = require('@langchain/core/messages');
const { BedrockEmbeddings } = require('@langchain/community/embeddings/bedrock');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');

class BedrockClaudeGenerate {
  constructor(creds) {
    this.model = new BedrockChat({
      model: 'anthropic.claude-3-sonnet-20240229-v1:0',
      region: 'us-west-2',
      // endpointUrl: "custom.amazonaws.com",
      credentials: creds,
      modelKwargs: {
        anthropic_version: 'bedrock-2023-05-31',
      },
    });

    this.embeddings = new BedrockEmbeddings({
      region: 'us-west-2',
      credentials: creds,
      model: 'amazon.titan-embed-text-v2:0', // Default value
    });
  }

  async filter_functions(functions, instruction) {
    const documents = functions.map((f) => {
      const { parameters, ...fDescription } = f.function;
      return JSON.stringify(fDescription);
    });

    const vectorStore = await MemoryVectorStore.fromTexts(documents, [], this.embeddings);
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

  async process_user_instruction(functions, instruction) {
    //console.log(functions.map((f) => f.function.name));
    // Define the function call format
    const fn = `{"name": "function_name"}`;

    // Prepare the function string for the system prompt
    const fnStr = functions.map((f) => JSON.stringify(f)).join('\n');

    // Define the system prompt
    const systemPrompt = `
        You are a helpful assistant with access to the following functions:

        ${fnStr}

        To use these functions respond with, only output function names, ignore arguments needed by those functions:

        <multiplefunctions>
            <functioncall> ${fn} </functioncall>
            <functioncall> ${fn} </functioncall>
            ...
        </multiplefunctions>

        Edge cases you must handle:
        - If there are multiple functions that can fullfill user request, list them all.
        - If there are no functions that match the user request, you will respond politely that you cannot help.
        - If the user has not provided all information to execute the function call, choose the best possible set of values. Only, respond with the information requested and nothing else.
        - If asked something that cannot be determined with the user's request details, respond that it is not possible to fulfill the request and explain why.
    `;

    // Prepare the messages for the language model
    const messages = [new SystemMessage({ content: systemPrompt }), new HumanMessage({ content: instruction })];

    // Invoke the language model and get the completion
    const completion = await this.model.invoke(messages);
    const content = completion.content.trim();

    // Extract function calls from the completion
    const extractedFunctions = this.extractFunctionCalls(content);

    console.log(extractedFunctions);

    return extractedFunctions;
  }

  extractFunctionCalls(completion) {
    let content = typeof completion === 'string' ? completion : completion.content;

    // Multiple functions lookup
    const mfnPattern = /<multiplefunctions>(.*?)<\/multiplefunctions>/s;
    const mfnMatch = content.match(mfnPattern);

    // Single function lookup
    const singlePattern = /<functioncall>(.*?)<\/functioncall>/s;
    const singleMatch = content.match(singlePattern);

    let functions = [];

    if (!mfnMatch && !singleMatch) {
      // No function calls found
      return null;
    } else if (mfnMatch) {
      // Multiple function calls found
      const multiplefn = mfnMatch[1];
      const fnMatches = [...multiplefn.matchAll(/<functioncall>(.*?)<\/functioncall>/gs)];
      for (let fnMatch of fnMatches) {
        const fnText = fnMatch[1].replace(/\\/g, '');
        try {
          functions.push(JSON.parse(fnText));
        } catch {
          // Ignore invalid JSON
        }
      }
    } else {
      // Single function call found
      const fnText = singleMatch[1].replace(/\\/g, '');
      try {
        functions.push(JSON.parse(fnText));
      } catch {
        // Ignore invalid JSON
      }
    }
    return functions;
  }
}

module.exports = BedrockClaudeGenerate;
