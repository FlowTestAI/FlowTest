import FlowtestAI from "../src/flowtest-ai";
import * as fs from 'fs';
import SwaggerParser from '@apidevtools/swagger-parser';


describe("generate", () => {
    it("should generate functions from openapi spec", async () => {
        const f = new FlowtestAI();
        const USER_INSTRUCTION = 'Instruction: Add a new pet to the store. \
            Then get the created pet. \
            Then get pet with status as available.';
        const testYaml = fs.readFileSync('tests/test.yaml', { encoding: 'utf8', flag: 'r' })
        let result = await f.generate(testYaml, USER_INSTRUCTION);
        const nodeNames = result.map((node) => node.name)
        expect(nodeNames).toEqual(['addPet', 'getPetById', 'findPetsByStatus']);
    }, 60000);
});