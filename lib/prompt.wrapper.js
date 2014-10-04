/**
 * # Prompt
 *
 * Wrapper around `prompt` module for injection purpose.
 */
module.exports = function(prompt) {
  return {
    /**
     * Start the prompt
     */
    start: function() {
      prompt.start();
    },

    /**
     * Get the result of the prompt
     *
     * @param {Object} promptConfig The configuration to setup the prompt
     * @param {Function} callback The callback to call once the user finished to enter the answers to the prompt
     */
    get: function(promptConfig, callback) {
      prompt.get(promptConfig, callback);
    }
  };
};

module.exports['@require'] = ['prompt'];
