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
  var requireWrapper;

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

    requireWrapper = {
      require: jasmine.createSpy()
    };

    var TemplateEngine = templateEngineFactory(nunjucks, {}, requireWrapper);

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

  it("Extra filters (sync/async) and tags (sync/async) should be available once configure was called on the template engine", function() {
    var mockEngine = {
      sFilters: {},
      aFilters: {},
      extensions: {},
      addFilter: function(name, filter, async) {
        if (async) {
          this.aFilters[name] = filter;
        }
        else {
          this.sFilters[name] = filter;
        }
      },
      addExtension: function(name, extension) {
        this.extensions[name] = extension;
      }
    };

    spyOn(mockEngine, 'addFilter').andCallThrough();
    spyOn(mockEngine, 'addExtension').andCallThrough();

    templateEngine.engine = mockEngine;

    requireWrapper.require.andCallFake(function(name) {
      expect(name).toEqual("extra");
      return {
        syncFilters: {
          sFilter1: function() {},
          sFilter2: function() {}
        },
        asyncFilters: {
          aFilter1: function() {},
          aFilter2: function() {}
        },
        syncTags: {
          sTag1: function() {},
          sTag2: function() {}
        },
        asyncTags: {
          aTag1: function() {},
          aTag2: function() {}
        }
      };
    });

    templateEngine.configure(["extra"]);

    expect(mockEngine.addFilter).toHaveBeenCalled();
    expect(mockEngine.addFilter.calls.length).toEqual(4);
    expect(mockEngine.addExtension).toHaveBeenCalled();
    expect(mockEngine.addExtension.calls.length).toEqual(4);

    expect(mockEngine.sFilters.sFilter1).toBeDefined();
    expect(mockEngine.sFilters.sFilter2).toBeDefined();
    expect(mockEngine.aFilters.aFilter1).toBeDefined();
    expect(mockEngine.aFilters.aFilter2).toBeDefined();

    expect(mockEngine.extensions.sTag1).toBeDefined();
    expect(mockEngine.extensions.sTag2).toBeDefined();
    expect(mockEngine.extensions.aTag1).toBeDefined();
    expect(mockEngine.extensions.aTag2).toBeDefined();
  });


  it("Multiple extra modules should be loaded", function() {
    var mockEngine = {
      filters: {},
      addFilter: function(name, filter, async) { this.filters[name] = filter; },
      addExtension: jasmine.createSpy()
    };

    spyOn(mockEngine, 'addFilter').andCallThrough();

    templateEngine.engine = mockEngine;

    var modules = {
      extra1: {
        syncFilters: {
          mf1: function() {}
        }
      },
      extra2: {
        syncFilters: {
          mf2: function() {}
        }
      }
    };

    requireWrapper.require.andCallFake(function(name) {
      return modules[name];
    });

    templateEngine.configure(["extra1", "extra2"]);

    expect(mockEngine.addFilter).toHaveBeenCalled();
    expect(mockEngine.addFilter.calls.length).toEqual(2);

    expect(mockEngine.filters.mf1).toBeDefined();
    expect(mockEngine.filters.mf2).toBeDefined();
  });

  it("Multiple extra modules with different syntax definition ((a|)sync(Filters|tags) vs. (filters|tags)(As|S)ync) should be loaded", function() {
    var mockEngine = {
      filters: {},
      addFilter: function(name, filter, async) { this.filters[name] = filter; },
      addExtension: jasmine.createSpy()
    };

    spyOn(mockEngine, 'addFilter').andCallThrough();

    templateEngine.engine = mockEngine;

    var modules = {
      extra1: {
        syncFilters: {
          mf1: function() {}
        }
      },
      extra2: {
        filtersSync: {
          mf2: function() {}
        }
      }
    };

    requireWrapper.require.andCallFake(function(name) {
      return modules[name];
    });

    templateEngine.configure(["extra1", "extra2"]);

    expect(mockEngine.addFilter).toHaveBeenCalled();
    expect(mockEngine.addFilter.calls.length).toEqual(2);

    expect(mockEngine.filters.mf1).toBeDefined();
    expect(mockEngine.filters.mf2).toBeDefined();
  });

});
