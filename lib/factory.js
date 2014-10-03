/**
 * # Factory
 *
 * Allow creating different object for the plumbing of the tool
 */
var ioc = require('./ioc');

module.exports = function(config, operations) {
  return {
    /**
     * Configuration factory
     */
    configurationFactory: config,

    /**
     * Operations factory
     */
    operationsFactory: operations,

    /**
     * Create a new configuration with the options given
     *
     * @param {Object} options The options to create the new configuration
     * @return {Configuration} The configuration created
     */
    createConfiguration: function(options) {
      return new this.configurationFactory(options);
    },

    /**
     * Create a new builder from the configuration
     *
     * @param {Configuration} configuration The configuration to create the builder
     * @return {Operations.Builder} The builder created
     */
    createBuilder: function(configuration) {
      return new this.operationsFactory.builder(configuration);
    },

    /**
     * Create a new processor from the configuration
     *
     * @param {Configuration} configuration The configuration to create the processor
     * @return {Operations.Processor} The processor created
     */
    createProcessor: function(configuration) {
      return new this.operationsFactory.processor(configuration);
    }
  };
};

module.exports['@require'] = ['config', 'operations'];
