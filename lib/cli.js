/**
 * # Client
 * Entry point to execute the tool
 */
var inflection = require('inflection'),
    _ = require('underscore');

module.exports = function(scaffolder, cliEnv) {
  function Cli() { }

  _.extend(Cli.prototype, {
    /**
     * Execute the project scaffolding
     *
     * @return {Q.Promise} A promise which the result of the process
     */
    execute: function() {
      return new scaffolder(this.loadEnvironmentOptions()).run().done();
    },

    /**
     * Retrieve from the environment variables the different options that
     * can be used by the tool
     *
     * ```
     * options:
     *   SCAFF_TEMPLATE_CONFIG_FILE:
     *      The template configuration file path
     *      default: scaff.yml
     *   SCAFF_TEMPLATE_FOLDER:
     *      The template folder path
     *      default: template
     * ```
     *
     * @return {Object} The options retrieved from the variables
     */
    loadEnvironmentOptions: function() {
      var options = _.reduce([ 'templateConfigFile', 'templateFolder' ], function(memo, name) {
        var envName = 'SCAFF_' + inflection.underscore(name).toUpperCase();

        if (_.has(cliEnv, envName)) {
          memo[name] = cliEnv[envName];
        }

        return memo;
      }, {});

      return options;
    }
  });

  return Cli;
};

module.exports['@require'] = [ 'scaffolder', 'cli.env' ];
