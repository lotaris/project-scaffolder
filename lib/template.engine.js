/**
 * # Template engine
 *
 * Bring the capability to generate the files through a template engine to be
 * able to apply some filtering of variables inside the file paths or contents.
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path');

module.exports = function(swig) {
  /**
   * Constructor
   */
  function TemplateEngine() {
    this.pathPattern = new RegExp(/__([^_]+)__/g);
  }

  _.extend(TemplateEngine.prototype, {
    /**
     * Generate a path by applying some filtering to the paths
     *
     * @param {Object} filteringConfig Configuration that contains properties that can be used to filter file paths
     * @param {String} path The path to filter
     * @return {String} Path filtered
     */
    renderPath: function(filteringConfig, path) {
      var finalStr = path;

      var match = this.pathPattern.exec(path);

      // Apply filtering until there is no more filter found in the path
      while (match !== null) {
        var holderDef = match[1].split('-');

        // Check if the variable in the path is known
        if (filteringConfig[holderDef[0]]) {
          // No filter to apply to the variable
          if (holderDef.length == 1) {
            finalStr = finalStr.replace('__' + match[1] + '__', filteringConfig[holderDef[0]]);
          }
          // Filter must be applied to the variable
          else {
            try {
              // Create a Swig filter syntax from the file filter syntax and apply the filtering
              var sw = swig.render('{{ ' + holderDef[0] + ' | ' + holderDef[1] + ' }}', { locals: filteringConfig });
              finalStr = finalStr.replace('__' + match[1] + '__', sw);
            }
            catch (error) {
              error.message = "Maybe you should try to take a look to your filter " + holderDef[1] + " which seems to be in error with: " + error.message;
              throw error;
            }
          }
        }

        match = this.pathPattern.exec(path);
      }

      return finalStr;
    },

    /**
     * Generate file content by applying some filtering to the content
     *
     * @param {Object} filteringConfig Configuration that contains properties that can be used to filter file paths
     * @param {String} path Path to the file to filter its content
     * @return {String} The file content after filtering is applied
     */
    renderFile: function(filteringConfig, path) {
      // Delegate the templating process to Swig
      return swig.renderFile(path, filteringConfig);
    }

  });

  return TemplateEngine;
};

module.exports['@require'] = ['swig'];
