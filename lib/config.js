/**
 * # Configuration
 *
 * Manage the state of the tool and its configuration to be able to generate
 * the the project properly.
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    yaml = require('js-yaml');

module.exports = function(prompt, print, fs) {
  /**
   * Define the `outputDirectory` to generate the project from the `template`
   */
  var globalPromptProperties = {
    outputDirectory: {
      message: "finally the output directory (will be created if not existing)",
      required: true
    }
  };

  /**
   * Constructor
   *
   * ```
   * options:
   *   templateEngine:
   *      Define the template engine to generate the files
   *      Required: true
   *   templateConfigFile:
   *      Define the path to the template configuration file
   *      Required: true
   *   templateFolder:
   *      Define the path to the template folder
   *      Required: true
   * ```
   */
  function Configuration(options) {
    if (options === undefined) {
      throw new Error("No options provided.");
    }

    if (options.templateEngine === undefined) {
      throw new Error("No template engine provided.");
    }
    else {
      this.templateEngine = options.templateEngine;
    }

    if (options.templateConfigFile === undefined) {
      throw new Error("No template configuration file provided.");
    }
    else {
      this.templateConfigPath = path.resolve(options.templateConfigFile);
    }

    if (options.templateFolder === undefined) {
      throw new Error("No template folder provided.");
    }
    else {
      this.templateFolderPath = path.resolve(options.templateFolder);
    }

    this.fileOperations = [];

    this.templateConfig = {};
  }

  _.extend(Configuration.prototype, {
    /**
     * A way to add a new file operation.
     *
     * @param {String} src The source path
     * @param {String} dest The destination path
     * @param {String} type The operation type (`copy` or `generate`)
     */
    addFileOperation: function(src, dest, type) {
      this.fileOperations.push( { src: src, dest: dest, type: type } );
    },

    /**
     * Retrieve the filtering configuration
     *
     * @return {Object} that contains the specific filtering values for the project generation
     */
    getFilteringConfig: function() {
      return this.templateConfig.filtering;
    },

    /**
     * Read the template configuration to be able to prompt the user about the
     * project generation from the template. It also load extras configuration
     * and process to the configuration.
     *
     * @return {Q.Promise} A promise
     */
    configure: function() {
      var deferred = Q.defer();

      // The template configuration file is mandatory
      if (this.templateConfigPath === undefined) {
        deferred.reject(new Error("The project configuration file is not configured"));
      }

      fs.readFile(this.templateConfigPath, null, _.bind(function(error, content) {
        if (error) {
          deferred.reject(new Error(error));
        }
        else {
          // Store the loaded config in a working variable
          var loadedConfig = yaml.safeLoad(content);

          // Ensure the properties are only the ones accepted by prompt
          var promptProperties;
          if (loadedConfig.prompt) {
             promptProperties = _.reduce(
              loadedConfig.prompt.properties || {},
              function(memo, value, key) {
                memo[key] = _.pick(value, 'description', 'type', 'pattern', 'message', 'hidden', 'default', 'required');
                return memo;
              },
              {}
            );
          }

          // Be sure there is an extras array and if yes, be sure this is an array
          var extras = _.isArray(loadedConfig.extras) ? loadedConfig.extras : [];

          // Build the configuration
          this.templateConfig = {
            prompt: {
              properties: promptProperties
            },
            extras: extras
          };

          // Add more configuration to the template engine
          this.templateEngine.configure(this.templateConfig.extras);

          deferred.resolve();
        }
      }, this));

      return deferred.promise;
    },

    /**
     * Manage a prompt to invite the user to answer few questions that will
     * be used during the project generation from the template.
     *
     * @return {Q.Promise} A promise
     */
    handlePrompt: function() {
      var deferred = Q.defer();

      prompt.start();

      // Add the `outputDirectory` property to be asked to the user
      _.extend(this.templateConfig.prompt.properties, globalPromptProperties);

      prompt.get(this.templateConfig.prompt, _.bind(function(error, result) {
        if (error) {
          deferred.reject(new Error(error));
        }
        else {
          /**
           * The output directory is extracted from the project configuration
           * and will be used for a general purpose.
           */
          this.templateConfig.filtering = _.omit(result, 'outputDirectory');
          this.outputDirectory = result.outputDirectory;

          print('Project configuration:');

          _.each(this.templateConfig.filtering, function(value, key) {
            print('  ' + key + ': ' + value);
          });

          deferred.resolve();
        }
      }, this));

      return deferred.promise;
    }
  });

  return Configuration;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['prompt.wrapper', 'print', 'fs-more'];
