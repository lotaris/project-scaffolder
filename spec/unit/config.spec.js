var _ = require('underscore'),
    path = require('path'),
    configFactory = require('../../lib/config.js'),
    Q = require('q');

describe("Config", function() {
  var Configuration;

  var defaultPromptResult = {
    outputDirectory: "./build/test"
  };

  var templateConfig = {
    groupId: "com.forbesdigtal",
    artifactIdPrefix: "project-scaffolder",
    package: "com.forbesdigital.wb",
    mavenPathShortName: "wb"
  };

  var yamlContent = "prompt:\n  properties:\n    test:\n      message: \"There is a message\"";

  var config;

  var messages = [];

  var prompt = {
    start: jasmine.createSpy(),
    get: jasmine.createSpy()
  };

  function print(str) {
    messages.push(str);
  }

  beforeEach(function() {
    messages = [];

    var fs = {
      readFile: jasmine.createSpy()
    };

    fs.readFile.andCallFake(function(path, options, callback) {
      callback(undefined, yamlContent);
    });

    Configuration = configFactory(prompt, print, fs);
    config = new Configuration({ templateEngine: {}, templateConfigFile: "config.yml", templateFolder: "project" });
  });

  it("Some options are mandatory to create a new configuration", function() {
    expect(function() { new Configuration(); }).toBeError("No options provided.");
    expect(function() { new Configuration({}); }).toBeError("No template engine provided.");
    expect(function() { new Configuration({ templateEngine: {}}); }).toBeError("No template configuration file provided.");
    expect(function() { new Configuration({ templateEngine: {}, templateConfigFile: "config.yml"}); }).toBeError("No template folder provided.");
    expect(function() { new Configuration({ templateEngine: {}, templateConfigFile: "config.yml", templateFolder: "project"}); }).not.toThrow();

    var conf = new Configuration({ templateEngine: {}, templateConfigFile: "config.yml", templateFolder: "project"});

    expect(conf.templateEngine).not.toBeUndefined();
    expect(conf.templateEngine).toEqual({});

    expect(conf.templateConfigPath).not.toBeUndefined();
    expect(conf.templateConfigPath).toEqual(path.resolve("config.yml"));

    expect(conf.templateFolderPath).not.toBeUndefined();
    expect(conf.templateFolderPath).toEqual(path.resolve("project"));
  });


  it("Create a new configuration should contains a template engine and an empty array file operations", function() {
    expect(config.fileOperations).not.toBeNull();
    expect(config.fileOperations.length).toEqual(0);

    expect(config.templateEngine).not.toBeNull();
    expect(config.templateEngine).toEqual({});
  });

  it("Should be possible to retrive the template filtering configuration on a configuration", function() {
    var conf = new Configuration({ templateEngine: {}, templateConfigFile: "scaff.yml", templateFolder: "template" });

    conf.templateConfig = {
      prop1: "val1",
      prop2: "val2",
      filtering: {
        filter1: "valfilter1",
        filter2: "valfilter2"
      }
    };

    var filtering = conf.getFilteringConfig();

    expect(filtering).not.toBeNull();

    expect(filtering.filter1).toBeDefined();
    expect(filtering.filter1).toEqual("valfilter1");

    expect(filtering.filter2).toBeDefined();
    expect(filtering.filter2).toEqual("valfilter2");
  });


  it("Handle project prompt should allow preparing project configuration and to show it", function() {
    config.templateConfig = {
      prompt: {
        properties: {}
      }
    };

    prompt.get.andCallFake(function(schema, callback) {
      callback(undefined, templateConfig);
    });

    config.handlePrompt();

    expect(config.templateConfig.filtering).not.toBeNull();

    expect(config.templateConfig.filtering.groupId).not.toBeNull();
    expect(config.templateConfig.filtering.groupId).toEqual(templateConfig.groupId);

    expect(config.templateConfig.filtering.artifactIdPrefix).not.toBeNull();
    expect(config.templateConfig.filtering.artifactIdPrefix).toEqual(templateConfig.artifactIdPrefix);

    expect(config.templateConfig.filtering.package).not.toBeNull();
    expect(config.templateConfig.filtering.package).toEqual(templateConfig.package);

    expect(config.templateConfig.filtering.mavenPathShortName).not.toBeNull();
    expect(config.templateConfig.filtering.mavenPathShortName).toEqual(templateConfig.mavenPathShortName);

    expect(messages.shift()).toEqual("Project configuration:");

    expect(messages.shift()).toContain(templateConfig.groupId);
    expect(messages.shift()).toContain(templateConfig.artifactIdPrefix);
    expect(messages.shift()).toContain(templateConfig.package);
    expect(messages.shift()).toContain(templateConfig.mavenPathShortName);
  });

  it("Project configuration should be available when read from YAML file", function() {
    // config.realProjectConfigFile = path.join(path.resolve(defaultPromptResult.outputDirectory), "config.yml");

    config.readConfiguration();

    expect(config.templateConfig).not.toBeNull();
    expect(config.templateConfig.prompt).not.toBeNull();
    expect(config.templateConfig.prompt.properties).not.toBeNull();
    expect(config.templateConfig.prompt.properties.test).not.toBeNull();

    expect(config.templateConfig.prompt.properties.test.message).not.toBeNull();
    expect(config.templateConfig.prompt.properties.test.message).toEqual("There is a message");
  });

  it("Project should contains operations when we add them", function() {
    config.addFileOperation("src1", "dst1", "copy");
    config.addFileOperation("src2", "dst2", "generate");

    expect(config.fileOperations).not.toBeNull();
    expect(config.fileOperations.length).toEqual(2);

    var first = config.fileOperations.shift();
    expect(first.src).toEqual("src1");
    expect(first.dest).toEqual("dst1");
    expect(first.type).toEqual("copy");

    var second = config.fileOperations.shift();
    expect(second.src).toEqual("src2");
    expect(second.dest).toEqual("dst2");
    expect(second.type).toEqual("generate");
  });
});
