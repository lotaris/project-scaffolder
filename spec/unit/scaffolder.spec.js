var path = require('path'),
    ProjectScaffolderFactory = require('../../lib/scaffolder.js');

describe("Scaffolder", function() {
  var scaffolder;
  var ProjectScaffolder;

  beforeEach(function() {
    ProjectScaffolder = ProjectScaffolderFactory();
    scaffolder = new ProjectScaffolder();
  });

  it("should have several build methods, an init method and a factory", function() {
    expect(scaffolder.factory).toBeDefined();
    expect(scaffolder.init).toBeDefined();
    expect(scaffolder.buildConfiguration).toBeDefined();
    expect(scaffolder.buildBuilderAndProcessor).toBeDefined();
  });

  it("Options should be configured correctly", function() {
    var scaff = new ProjectScaffolder();

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.templateConfigFile).toEqual('scaff.yml');
    expect(scaff.options.templateFolder).toEqual('template');

    scaff = new ProjectScaffolder({});

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.templateConfigFile).toEqual('scaff.yml');
    expect(scaff.options.templateFolder).toEqual('template');

    scaff = new ProjectScaffolder({ templateConfigFile: 'someOtherConfig.yml' });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.templateConfigFile).toEqual('someOtherConfig.yml');
    expect(scaff.options.templateFolder).toEqual('template');

    scaff = new ProjectScaffolder({ templateFolder: 'someOtherFolder' });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.templateConfigFile).toEqual('scaff.yml');
    expect(scaff.options.templateFolder).toEqual('someOtherFolder');

    scaff = new ProjectScaffolder({ templateConfigFile: 'someOtherConfig.yml', templateFolder: 'someOtherFolder' });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.templateConfigFile).toEqual('someOtherConfig.yml');
    expect(scaff.options.templateFolder).toEqual('someOtherFolder');
  });

  it("calling buildConfiguration should prepare a configuration", function() {
    scaffolder.buildConfiguration();

    expect(scaffolder.config).toBeDefined();
  });

  it("calling buildBuilderAndProcessor should prepare a builder and processor", function() {
    scaffolder.config = {};

    scaffolder.buildBuilderAndProcessor();

    expect(scaffolder.builder).toBeDefined();
    expect(scaffolder.processor).toBeDefined();
  });

  it("calling init method should call the different build methods", function() {
    spyOn(scaffolder, 'buildConfiguration').andCallFake(function() {});
    spyOn(scaffolder, 'buildBuilderAndProcessor').andCallFake(function() {});

    scaffolder.init();

    expect(scaffolder.buildConfiguration).toHaveBeenCalled();
    expect(scaffolder.buildBuilderAndProcessor).toHaveBeenCalled();
  });
});
