var _ = require('underscore'),
    path = require('path'),
    templateEngineFactory = require('../../lib/template.engine.js'),
    Q = require('q');

describe("Template.Engine", function() {
  var filteringConfig = {
    valueToReplace: "amazing"
  };

  var templateEngine;
  var renderString;
  var render;

  beforeEach(function() {
    renderString = jasmine.createSpy();
    render = jasmine.createSpy();

    var nunjucks = {
      Environment: function() {
        this.renderString = renderString;
        this.render = render;
        this.addFilter = jasmine.createSpy();
      }
    };

    var TemplateEngine = templateEngineFactory(nunjucks);

    templateEngine = new TemplateEngine();
  });

  it("Create a template engine should make available a Regex pattern for the file path replacement", function() {
    expect(templateEngine.pathPattern).not.toBeNull();
    expect(templateEngine.pathPattern).toEqual(new RegExp(/__([^_]+)__/g));
  });

  it("For a path with three values to filter, the exec method on regex should be called three times", function() {
    spyOn(templateEngine.pathPattern, 'exec').andCallThrough();

    var result = templateEngine.renderPath(filteringConfig, "__valueToReplace__/somePath/__valueToReplace__/someOtherPath/__valueToReplace__");

    expect(templateEngine.pathPattern.exec.calls.length).toEqual(4);
    expect(result).toEqual("amazing/somePath/amazing/someOtherPath/amazing");
  });

  it("For a path with three values with nunjucks filters to filter, the exec method on regex should be called three times", function() {
    renderString.andCallFake(function(string, options) {
      return filteringConfig.valueToReplace;
    });

    spyOn(templateEngine.pathPattern, 'exec').andCallThrough();

    var result = templateEngine.renderPath(filteringConfig, "__valueToReplace-filter__/somePath/__valueToReplace-filter__/someOtherPath/__valueToReplace__");

    expect(templateEngine.pathPattern.exec.calls.length).toEqual(4);
    expect(renderString.calls.length).toEqual(2);
    expect(result).toEqual("amazing/somePath/amazing/someOtherPath/amazing");
  });

  it("Rendering a file should be delegated to nunjucks with proper parameters", function() {
    render.andCallFake(function(path, options, callback) {
      callback(null, "someFileContentRendered");
    });

    templateEngine.renderFile(filteringConfig, "some/path/to/a/file").then(function(result) {
      expect(result).toEqual('someFileContentRendered');
    });

    waitsFor(function() {
      return render.calls.length;
    }, "render should have been called", 100);

    runs(function() {
      expect(render).toHaveBeenCalledWith("some/path/to/a/file", filteringConfig, jasmine.any(Function));
    });
  });

  it("An error should be thrown when there is an error occurs in the path rendering", function() {
    renderString.andCallFake(function(path, options) {
      throw new Error("Dummy error");
    });

    expect(function() {
      templateEngine.renderPath(config, "__valueToReplace-filter__/somePath/__valueToReplace-filter__/someOtherPath/__valueToReplace__");
    }).toThrow();
  });
});
