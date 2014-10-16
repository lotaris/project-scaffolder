/**
 * # Template engine
 *
 * Bring the capability to generate the files through a template engine to be
 * able to apply some filtering of variables inside the file paths or contents.
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    roxClient = require('rox-client-node');

module.exports = function(nunjucks, fs) {
  /**
   * Template loader to be able to use absolute paths. This is not possible
   * out of the box in Nunjucks
   */
  function TemplateLoader(options) { }

  _.extend(TemplateLoader.prototype, {
    async: true,

    /**
     * Retrieve the template content from its name which is an absolute path
     *
     * @param {String} name The template name
     * @return {Object} The template loaded, its path and a caching instruction
     */
    getSource: function(name, callback) {
      callback(null, {
        src: fs.readFileSync(name).toString(),
        path: name,
        noCache: true
      });
    }
  });

  /**
   * Constructor
   */
  function TemplateEngine() {
    this.pathPattern = new RegExp(/__([^_]+)__/g);

    // Initilialize the template engine
    this.engine = new nunjucks.Environment(new TemplateLoader());
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
              // Create a Nunjucks filter syntax from the file filter syntax and apply the filtering
              var sw = this.engine.renderString('{{ ' + holderDef[0] + ' | ' + holderDef[1] + ' }}', filteringConfig);
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
      // Delegate the templating process to Nunjucks
      return Q.nfcall(_.bind(this.engine.render, this.engine, path, filteringConfig));
    }
  });

  return TemplateEngine;
};

module.exports['@require'] = ['nunjucks', 'fs-more'];
