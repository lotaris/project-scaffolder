/**
 * # Operations processor
 *
 * Processor of file operations to generate the final project from the template
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path');

module.exports = function(fs) {
  /**
   * Constructor
   *
   * @param {Configuration} config The configuration to build the processor
   */
  function OperationsProcessor(config) {
    this.config = config;
  }

  _.extend(OperationsProcessor.prototype, {
    /**
     * Process the file operations to generate the resulting project from
     * template. Apply the different filtering and templating mechanism.
     *
     * @return {Q.Promise} A promise that handle an array of promises
     */
    processOperations: function() {
      // Prepare a promise for each file operation
      return Q.all(_.map(this.config.fileOperations, function(fileOperation) {
        return Q.fcall(_.bind(this.processOperation, this), fileOperation);
      }, this));
    },

    /**
     * Process a single file operation.
     *
     * @param {Object} operation An object that represent a file operation
     * @return {Q.Promise} A promise to handle the file operation
     */
    processOperation: function(operation) {
      // Check if the operation type is supported and process the operation
      if (operation.type == "copy") {
        return this.copyFile(operation);
      }
      else if (operation.type == "generate") {
        return this.generateFile(operation);
      }
      else {
        throw new Error("Unsupported operation type. Current supported types: copy, generate");
      }
    },

    /**
     * Generate file operation. Take a file source and apply a template mechanism.
     * The destination file is the file in its final shape ready to use.
     *
     * @param {Object} operation An object that represent a file operation
     * @return {Q.Promise} A promise to handle the generation operation
     */
    generateFile: function(operation) {
      return fs.outputFileQ(operation.dest, this.config.templateEngine.renderFile(this.config.getFilteringConfig(), operation.src));
    },

    /**
     * Copy file operation. Take file source and copy it to a destination without
     * applying any templating mechanism.
     *
     * @param {Object} operation An object that represent a file operation
     * @return {Q.Promise} A promise to handle the copy operation
     */
    copyFile: function(operation) {
      return fs.copyQ(operation.src, operation.dest);
    }
  });

  return OperationsProcessor;
};

module.exports['@require'] = ['fs-more'];
