var _ = require('underscore'),
    path = require('path'),
    operationsProcessorFactory = require('../../lib/operations.processor.js'),
    Q = require('q');

describe("Operations.Processor", function() {
  var config = {
    outputDirectory: "./build/test",
    templateConfig: {
      filtering: {}
    }
  };

  var fs;
  var processor;

  beforeEach(function() {
    config.fileOperations = [];

    fs = {
      copyQ: jasmine.createSpy(),
      outputFileQ: jasmine.createSpy()
    };

    config.templateEngine = {
      renderFile: jasmine.createSpy()
    };

    config.getFilteringConfig = jasmine.createSpy();

    var OperationsProcessor = operationsProcessorFactory(fs);

    processor = new OperationsProcessor(config);
  });

  it ("Create a new processor should have a proper configuration", function() {
    expect(processor.config).toEqual(config);
  });


  it ("copyFile should call fs.copy", function() {
    fs.copyQ.andCallFake(function(operation, callback) {});

    processor.copyFile({src: 'source', dest: 'destination'});

    waitsFor(function() {
      return fs.copyQ.calls.length;
    }, "copy should have been called", 100);

    runs(function() {
      expect(fs.copyQ).toHaveBeenCalledWith('source', 'destination');
    });
  });

  it ("generateFile should call fs.outputFile", function() {
    fs.outputFileQ.andCallFake(function(operation, callback) {});

    config.getFilteringConfig.andCallFake(function() {
      return this.templateConfig.filtering;
    });

    config.templateEngine.renderFile.andCallFake(function(string, options, callback) {
      return {
        then: function(fn) {
          fn('templateContent');
        }
      };
    });

    processor.generateFile({src: 'source', dest: 'destination'});

    waitsFor(function() {
      return fs.outputFileQ.calls.length;
    }, "outputFile should have been called", 100);

    runs(function() {
      expect(fs.outputFileQ).toHaveBeenCalledWith('destination', 'templateContent');
    });
  });

  it ("Process operation should call copy when the operation is from copy type", function() {
    spyOn(processor, 'copyFile').andCallFake(function(operation) {});

    processor.processOperation({src: 'source', dest: 'destination', type: 'copy'});

    waitsFor(function() {
      return processor.copyFile.calls.length;
    }, "copyFile should have been called", 100);

    runs(function() {
      expect(processor.copyFile).toHaveBeenCalledWith({src: 'source', dest: 'destination', type: 'copy'});
    });
  });

  it ("Process operation should call outputFile when the operation is from generate type", function() {
    spyOn(processor, 'generateFile').andCallFake(function(operation) {});

    processor.processOperation({src: 'source', dest: 'destination', type: 'generate'});

    waitsFor(function() {
      return processor.generateFile.calls.length;
    }, "generateFile should have been called", 100);

    runs(function() {
      expect(processor.generateFile).toHaveBeenCalledWith({src: 'source', dest: 'destination', type: 'generate'});
    });
  });

  it ("Process operation should throw an error when the operation is from unknown type", function() {

    expect(function() {
      processor.processOperation({src: 'source', dest: 'destination', type: 'unknown'});
    }).toThrow();
  });

  it ("Process operations should call the process operation method", function() {
    config.fileOperations.push({src: 'source', dest: 'destination', type: 'copy'});

    spyOn(processor, 'processOperation').andCallFake(function(operation) {});

    processor.processOperations();

    waitsFor(function() {
      return processor.processOperation.calls.length;
    }, "processOperation should have been called", 100);

    runs(function() {
      expect(processor.processOperation).toHaveBeenCalledWith(config.fileOperations[0]);
    });
  });

  it ("Process operations should call the process operation for each operation", function() {
    config.fileOperations.push({src: 'source1', dest: 'destination1', type: 'copy'});
    config.fileOperations.push({src: 'source2', dest: 'destination2', type: 'generate'});
    config.fileOperations.push({src: 'source3', dest: 'destination3', type: 'copy'});

    spyOn(processor, 'processOperation').andCallFake(function(operation) {});

    processor.processOperations();

    waitsFor(function() {
      return processor.processOperation.calls.length == 3;
    }, "processOperation should have been called", 1000);

    runs(function() {
      expect(processor.processOperation).toHaveBeenCalledWith(config.fileOperations[0]);
      expect(processor.processOperation).toHaveBeenCalledWith(config.fileOperations[1]);
      expect(processor.processOperation).toHaveBeenCalledWith(config.fileOperations[2]);
    });
  });
});
