import FlowtestAI from "../src/flowtest-ai";


describe("generate", () => {
    it("should generate functions from openapi spec", async () => {
        const f = new FlowtestAI();
        let result = await f.generate("");
        //expect(nodes).toEqual(expected);
    });
});