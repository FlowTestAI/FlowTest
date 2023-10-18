function add(a: number, b: number): number {
    return a + b;
}

describe("Math functions", () => {
    it("should add two numbers correctly", () => {
      expect(add(1, 2)).toEqual(3);
    });
  });