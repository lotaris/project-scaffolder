/**
 * # Operations builder
 *
 * Builder of template operations to generate the final project from the template
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path');

module.exports = function(fs, ibfs) {
  /**
   * Constructor
   *
   * @param {Configuration} config The configuration to create the builder
   */
  function OperationsBuilder(config) {
    this.config = config;
  }

  _.extend(OperationsBuilder.prototype, {
    /**
     * Generate the list of operations for a project generation
     *
     * @return {Q.Promise} A promise
     */
    generateOperations: function() {
      var deferred = Q.defer();

      this.inspectDirectory('').then(deferred.resolve);

      return deferred.promise;
    },

    /**
     * Inspect a directory to analyse what kind of operation should be created. This will
     * will recursively executed to analyse a whole directory structure.
     *
     * @param {String} directory The current level of directory to analyse
     * @return {Q.Promise} A promise
     */
    inspectDirectory: function(directory) {
      var deferred = Q.defer();

      var currentDirectory = path.join(this.config.templateFolderPath, directory);

      var self = this;

      /**
       * Read the directory to extract the files and iterate over them to
       * check if a directory must be analyzed.
       */
      fs.readdir(currentDirectory, function(error, files) {
        deferred.resolve(Q.all(_.map(files, function(file) {
          return Q.nfcall(
            fs.stat,
            path.join(currentDirectory, file)
          ).then(
            _.bind(
              self.createFileOrDirectoryOperation,
              self,
              directory,
              file
            )
          );
        })));
      });

      return deferred.promise;
    },

    /**
     * create a file or directory operation. If a directory is discovered,
     * we will recurse to continue to create file operations.
     *
     * @param {String} directory The current directory level
     * @param {String} file the current file in the directory
     * @param {fs.Stat} stat The info about the file do the difference between file and directory
     * @return {Q.Promise} A promise for a file or directory operation
     */
    createFileOrDirectoryOperation: function(directory, file, stat) {
      var self = this;

      // Create a file operation when a file is discovered
      if (stat.isFile()) {
        return Q.nfcall(
          ibfs,
          path.join(this.config.templateFolderPath, directory, file)
        ).then(
          _.bind(
            self.createFileOperation,
            self,
            directory,
            file
          )
        );
      }

      // Recurse the analysis of directory when a directory is discovered
      else {
        return this.inspectDirectory(path.join(directory, file));
      }
    },

    /**
     * Create a file operation. We can create:
     *
     * * `copy`: Copy a file from a template to a destination
     * * `generate`: Generate a file from a source a save it to the target
     *
     * @param {String} directory The current directory level
     * @param {String} file the current file in the directory
     * @param {Object} result File analysis result to differentiate binary file than textual file
     */
    createFileOperation: function(directory, file, result) {
      var source = path.resolve(path.join(this.config.templateFolderPath, directory, file));
      var target = path.resolve(this.config.templateEngine.renderPath(this.config.getFilteringConfig(), path.join(this.config.outputDirectory, directory, file)));

      /*
       * If the file is binary, we create a copy operation that will not use
       * templating mechanism to filter the file.
       */
      if (result) {
        this.config.addFileOperation(source, target, "copy");
      }
      else {
        this.config.addFileOperation(source, target, "generate");
      }
    }
  });

  return OperationsBuilder;
};

module.exports['@require'] = ['fs-more', 'isbinaryfile'];
