var factoryFactory = require('../../lib/factory.js');

describe("Factory", function() {
  var factory;

  beforeEach(function() {
    var config = jasmine.createSpy();

    config.andCallFake(function() {
      return {};
    });

    var builderAndProcessor = jasmine.createSpy();

    builderAndProcessor.andCallFake(function() {
      return {};
    });

    factory = factoryFactory(config, { builder: builderAndProcessor, processor: builderAndProcessor });
  });

  it("Factory should have Configuration and  Operations factories", function() {
    expect(factory.configurationFactory).toBeDefined();
    expect(factory.operationsFactory).toBeDefined();
    expect(factory.configurationFactory).toEqual(jasmine.any(Function));
    expect(factory.operationsFactory).toEqual(jasmine.any(Object));
  });

  it("Factory module should have createConfiguration method", function() {
    expect(factory.createConfiguration).toBeDefined();
    expect(factory.createConfiguration).toEqual(jasmine.any(Function));
  });

  it("Factory module should have createBuilder method", function() {
    expect(factory.createBuilder).toBeDefined();
    expect(factory.createBuilder).toEqual(jasmine.any(Function));
  });

  it("Factory module should have createProcessor method", function() {
    expect(factory.createProcessor).toBeDefined();
    expect(factory.createProcessor).toEqual(jasmine.any(Function));
  });

  it("Factory createConfiguration should return a new configuration", function() {
    var config = factory.createConfiguration({ templateEngine: {}, templateConfigFile: "config.yml", templateFolder: "project" });

    expect(config).not.toBeNull();
  });

  it("Factory createBuilder should return a new builder", function() {
    var builder = factory.createBuilder({});

    expect(builder).not.toBeNull();
  });

  it("Factory createProcessor should return a new processor", function() {
    var processor = factory.createProcessor({});

    expect(processor).not.toBeNull();
  });

});
