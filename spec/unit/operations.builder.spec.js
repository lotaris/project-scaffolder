var _ = require('underscore'),
    path = require('path'),
    operationsBuilderFactory = require('../../lib/operations.builder.js'),
    Q = require('q');

describe("Operations.Builder", function() {
  var config = {
    outputDirectory: "./build/test",
    templateFolderPath: path.resolve("./project"),
    fileOperations: [],
    addFileOperation: function(src, dst, type) {
      this.fileOperations.push( { src: src, dest: dst, type: type } );
    },
    getFilteringConfig: function() {
      return {};
    }
  };

  var fs;
  var builder;

  beforeEach(function() {
    fs = {
      readdir: jasmine.createSpy(),
      stat: jasmine.createSpy()
    };

    var ibfs = function(str, callback) {
      callback(null, {});
    };

    config.templateEngine = {
      renderPath: function(filteringConfig, str) {
        return str;
      }
    };

    spyOn(config.templateEngine, 'renderPath').andCallThrough();

    var OperationsBuilder = operationsBuilderFactory(fs, ibfs);

    builder = new OperationsBuilder(config);
  });

  it ("Create a new builder should have a proper configuration", function() {
    expect(builder.config).toEqual(config);
  });

  it("A copy file operation is created when a file is binary", function() {
    builder.createFileOperation(path.join('path', 'to', 'the', 'file'), 'file.bin', {});

    expect(config.fileOperations).not.toBeNull();
    expect(config.fileOperations.length).toEqual(1);

    var fileOp = config.fileOperations.shift();

    expect(fileOp.src).toEqual(path.resolve(path.join(config.templateFolderPath, path.join('path', 'to', 'the', 'file'), 'file.bin')));
    expect(fileOp.dest).toEqual(path.resolve(path.join(config.outputDirectory, path.join('path', 'to', 'the', 'file'), 'file.bin')));
    expect(fileOp.type).toEqual("copy");
  });

  it("A generate file operation is created when a file is not binary", function() {
    builder.createFileOperation(path.join('path', 'to', 'the', 'file'), "file.md", null);

    expect(config.fileOperations).not.toBeNull();
    expect(config.fileOperations.length).toEqual(1);

    var fileOp = config.fileOperations.shift();

    expect(fileOp.src).toEqual(path.resolve(path.join(config.templateFolderPath, path.join('path', 'to', 'the', 'file'), "file.md")));
    expect(fileOp.dest).toEqual(path.resolve(path.join(config.outputDirectory, path.join('path', 'to', 'the', 'file'), "file.md")));
    expect(fileOp.type).toEqual("generate");
  });

  it("Create file or directory operation should inspect a directory when the file is detected as a directory", function() {
    builder.inspectDirectory = function() {};

    spyOn(builder, 'inspectDirectory');

    builder.createFileOrDirectoryOperation(path.join('path', 'to', 'directory'), 'dir', { isFile: function() { return false; } });

    expect(builder.inspectDirectory).toHaveBeenCalledWith(path.join('path', 'to', 'directory', 'dir'));
  });

  it("Create file or directory operation should create a file operation when the file is detected as a file", function() {
    spyOn(builder, 'createFileOperation');

    builder.createFileOrDirectoryOperation(path.join('path', 'to', 'directory'), 'file.bin', { isFile: function() { return true; } });

    waitsFor(function() {
      return builder.createFileOperation.calls.length;
    }, "createFileOperation to have been called", 100);

    runs(function() {
      expect(builder.createFileOperation).toHaveBeenCalledWith(path.join('path', 'to', 'directory'), 'file.bin', {});
    });
  });

  it("Inspect directory should call stat on the files", function() {
    fs.readdir.andCallFake(function(file, callback) {
      callback(null, [
        'oneFile.ext'
      ]);
    });

    fs.stat.andCallFake(function(file, callback) {
      callback(null, {
        isFile: function() { return true; }
      });
    });

    spyOn(builder, 'createFileOrDirectoryOperation').andCallFake(function(directory, file, stat) {});

    builder.inspectDirectory('directory');

    waitsFor(function() {
      return fs.stat.calls.length && builder.createFileOrDirectoryOperation.calls.length;
    }, "stat and createFileOrDirectoryOperation to have been called", 100);

    runs(function() {
      expect(fs.stat).toHaveBeenCalledWith(path.join(config.templateFolderPath, 'directory', 'oneFile.ext'), jasmine.any(Function));
      expect(builder.createFileOrDirectoryOperation).toHaveBeenCalledWith('directory', 'oneFile.ext', { isFile: jasmine.any(Function) });
    });
  });

  it ("Generate operations should use the inspectDirectory", function() {
    spyOn(builder, 'inspectDirectory').andCallFake(function(directory) { return { then: function(arg) {} }; });

    builder.generateOperations();

    expect(builder.inspectDirectory).toHaveBeenCalledWith('');
  });
});
