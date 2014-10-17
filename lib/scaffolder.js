/**
 * # Scaffolder
 *
 * Brings all the plumbing to execute the project generation from the template
 */
var ioc = require('./ioc'),
  Q = require('q'),
  _ = require('underscore'),
  path = require('path');

module.exports = function() {
  /**
   * Constructor
   *
   * At the moment, only two options are supported:
   *
   * * `templateConfigFile`: A path to the configuration file of the template<br /><strong>default</strong>: `scaff.yml`
   * * `templateFolder`: A path to the folder that contains the template files<br /><strong>default</strong>: `template`
   *
   * @params {Object} options The options to create the project scaffolder
   */
  function Scaffolder(options) {
    this.factory = ioc.create('factory');

    /**
     * Handle the options and make sure defaults ones are used when
     * no option is given
     */
    this.options = _.defaults(
      _.pick(
        options || {},
        'templateConfigFile',
        'templateFolder'
      ),
      {
        templateConfigFile: 'scaff.yml',
        templateFolder: 'template'
      }
    );
  }

  _.extend(Scaffolder.prototype, {
    /**
     * Initialize the scaffolder
     */
    init: function() {
      this.buildConfiguration();
      this.buildBuilderAndProcessor();
    },

    /**
     * Build the configuration which is the state of the tool
     */
    buildConfiguration: function() {
      var TemplateEngine = ioc.create('template.engine');

      this.config = this.factory.createConfiguration(
        _.extend(
          _.pick(
            this.options,
            'templateConfigFile',
            'templateFolder'
          ),
          {
            templateEngine: new TemplateEngine()
          }
        )
      );
    },

    /**
     * Build the file `builder` and `processor` to handle the different
     * file operations during the whole process of project generation.
     */
    buildBuilderAndProcessor: function() {
      this.builder = this.factory.createBuilder(this.config);
      this.processor = this.factory.createProcessor(this.config);
    },

    /**
     * Run the project generation from the project template.
     *
     * The file operations are processed with non-blocking I/O.
     */
    run: function() {
      this.init();

      // Execute the whole chain of promise
      return this.config.configure()
        .then(_.bind(this.config.handlePrompt, this.config))
        .then(_.bind(this.builder.generateOperations, this.builder))
        .then(_.bind(this.processor.processOperations, this.processor));
    }
  });

  return Scaffolder;
};
