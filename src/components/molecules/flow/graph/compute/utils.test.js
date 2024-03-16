const { computeVariables } = require('./utils');

describe('Utils', () => {
  it('should compute variables correctly', () => {
    let str = 'hello {{var1}}! hello {{var1}}! bye';
    let dict = {
      var1: 'world',
    };

    let result = computeVariables(str, dict);
    expect(result).toEqual('hello world! hello world! bye');

    str = 'hello {{var1}}! hello {{var2}}! bye';
    expect(() => {
      computeVariables(str, dict);
    }).toThrow(Error);

    str = 'hello {{var1}}! hello {{var2}}! bye';
    dict = null;
    expect(() => {
      computeVariables(str, dict);
    }).toThrow(Error);

    dict = {
      var1: 'world',
      var2: 'person',
    };
    result = computeVariables(str, dict);
    expect(result).toEqual('hello world! hello person! bye');

    str = 'hello world!';
    result = computeVariables(str, dict);
    expect(result).toEqual(str);
  });
});
