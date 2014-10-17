var requireWrapperFactory = require('../../lib/require.wrapper.js');

describe("Require.Wrapper", function() {
  var requireWrapper;

  beforeEach(function() {
    requireWrapper = requireWrapperFactory();
  });

  it("Require wrapper module should have require method", function() {
    expect(requireWrapper.require).toBeDefined();
  });
});
