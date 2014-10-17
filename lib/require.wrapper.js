/**
 * # Require
 *
 * Wrapper around `require` for injection purpose.
 */
module.exports = function() {
  return {
    /**
     * Call the real require method
     *
     * @param {String} moduleName The module to require
     * @param {*} The result returned by require
     */
    require: function(moduleName) {
      return require(moduleName);
    }
  };
};

module.exports['@singleton'] = true;
module.exports['@require'] = [];
