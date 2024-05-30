const fs = require('fs');
const SwaggerParser = require('@apidevtools/swagger-parser');
const JsonRefs = require('json-refs');
const FlowtestAI = require('../../src/ai/flowtestai');

describe('generate', () => {
  it('should generate functions using openai', async () => {
    const f = new FlowtestAI();
    const USER_INSTRUCTION =
      'Add a new pet to the store. \
            Then get the created pet. \
            Then get pet with status as available.';
    //const testYaml = fs.readFileSync('tests/test.yaml', { encoding: 'utf8', flag: 'r' });
    let api = await SwaggerParser.validate('tests/test.yaml');
    console.log('API name: %s, Version: %s', api.info.title, api.info.version);
    const resolvedSpec = (await JsonRefs.resolveRefs(api)).resolved;

    let result = await f.generate(resolvedSpec, USER_INSTRUCTION, {
      name: 'OPENAI',
      apiKey: '',
    });
    const nodeNames = result.map((node) => node.name);
    expect(nodeNames).toEqual(['addPet', 'getPetById', 'findPetsByStatus']);
  }, 60000);

  it('should generate functions using bedrock', async () => {
    const f = new FlowtestAI();
    const USER_INSTRUCTION =
      'Add a new pet to the store. \
            Then get the created pet. \
            Then get pet with status as available.';
    //const testYaml = fs.readFileSync('tests/test.yaml', { encoding: 'utf8', flag: 'r' });
    let api = await SwaggerParser.validate('tests/test.yaml');
    console.log('API name: %s, Version: %s', api.info.title, api.info.version);
    const resolvedSpec = (await JsonRefs.resolveRefs(api)).resolved;

    let result = await f.generate(resolvedSpec, USER_INSTRUCTION, {
      name: 'BEDROCK_CLAUDE',
      apiKey: {
        accessKeyId: '',
        secretAccessKey: '',
      },
    });
    const nodeNames = result.map((node) => node.name);
    expect(nodeNames).toEqual(['addPet', 'getPetById', 'findPetsByStatus']);
  }, 60000);
});
