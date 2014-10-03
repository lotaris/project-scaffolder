/**
 * # Operations
 *
 * Groups the `builder` and `processor` of file operations.
 */
module.exports = function(builder, processor) {
  return {
    builder: builder,
    processor: processor
  };
};

module.exports['@require'] = ['operations.builder', 'operations.processor'];
