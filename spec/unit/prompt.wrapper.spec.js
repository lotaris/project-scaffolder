var prompt = require('../../lib/prompt.wrapper.js');

describe("Prompt.Wrapper", function() {
  var promptWrapper;
  var promptImpl;

  beforeEach(function() {
    promptImpl = {
      start: jasmine.createSpy(),
      get: jasmine.createSpy()
    };

    promptWrapper = prompt(promptImpl);
  });

  it("Prompt module should have start method", function() {
    expect(promptWrapper.start).toBeDefined();
  });

  it("Prompt module should have get method", function() {
    expect(promptWrapper.get).toBeDefined();
  });

  it("Prompt wrapper should call the impl start method", function() {
    promptImpl.start.andCallFake(function() {});

    promptWrapper.start();

    expect(promptImpl.start).toHaveBeenCalled();
  });

  it("Prompt wrapper should call the impl get method with the correct arguments", function() {
    promptImpl.get.andCallFake(function(schema, callback) {});

    promptWrapper.get({}, function() {});

    expect(promptImpl.get).toHaveBeenCalledWith({}, jasmine.any(Function));
  });
});
