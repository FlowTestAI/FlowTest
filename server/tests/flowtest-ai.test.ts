import FlowtestAI from "../src/flowtest-ai";


describe("generate", () => {
    it("should generate functions from openapi spec", async () => {
        const f = new FlowtestAI();
        const USER_INSTRUCTION = 'Instruction: Add a new pet to the store. \
            Then get the created pet. \
            Then get pet with status as available.';
        let result = await f.generate(USER_INSTRUCTION);
        const nodeNames = result.map((node) => node.name)
        expect(nodeNames).toEqual(['addPet', 'getPetById', 'findPetsByStatus']);
    }, 15000);
});