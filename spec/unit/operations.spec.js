var operationsFactory = require('../../lib/operations.js');

describe("Operations", function() {
  it ("Getting module Operations should make available a builder and a processor", function() {
    var ops = new operationsFactory({builder: true}, {processor: true});

    expect(ops).not.toBeNull();

    expect(ops.builder).not.toBeNull();
    expect(ops.builder).toEqual({builder: true});

    expect(ops.processor).not.toBeNull();
    expect(ops.processor).toEqual({processor: true});
  });
});
