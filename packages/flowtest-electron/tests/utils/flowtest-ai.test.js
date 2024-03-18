const fs = require('fs');
const SwaggerParser = require('@apidevtools/swagger-parser');
const JsonRefs = require('json-refs');
const FlowtestAI = require('../../src/utils/flowtestai');

describe('generate', () => {
  it('should generate functions from openapi spec', async () => {
    const f = new FlowtestAI();
    const USER_INSTRUCTION =
      'Instruction: Add a new pet to the store. \
            Then get the created pet. \
            Then get pet with status as available.';
    //const testYaml = fs.readFileSync('tests/test.yaml', { encoding: 'utf8', flag: 'r' });
    let api = await SwaggerParser.validate('tests/test.yaml');
    console.log('API name: %s, Version: %s', api.info.title, api.info.version);
    const resolvedSpec = (await JsonRefs.resolveRefs(api)).resolved;

    let result = await f.generate(resolvedSpec, USER_INSTRUCTION);
    const nodeNames = result.map((node) => node.name);
    expect(nodeNames).toEqual(['addPet', 'getPetById', 'findPetsByStatus']);
  }, 60000);
});
