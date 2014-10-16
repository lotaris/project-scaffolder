// # Project Scaffolder
// Generate new projects from project templates
//
// This tool provides a pattern to run sequential asynchronous steps while
// avoiding callbacks with the use of [promises](http://promises-aplus.github.io/promises-spec/).
// Promises are provided by the [q](https://github.com/kriskowal/q) library.
// In addition, [Nunjucks](http://mozilla.github.io/nunjucks/) is used to render the project template files. This is an Asynchronous template engine.
var ioc = require('./ioc');

// ## Components
//
// * [cli.js](cli.js.html) - The cli brings the capability to execute the project scaffolder from the `project-scaffolder-cli`;
// * [cli.env.js](cli.env.js.html) - The cli environment is a wrapper to get the process.env;
// * [config.js](config.js.html) - the class that store the configuration and the state of the project scaffolder across all the steps of execution;
// * [operations.js](operations.js.html) - offer a simple way to get the builder and the processor of file operations;
// * [operations.builder.js](operations.builder.js.html) - module to create the various file operations to generate the project from the template;
// * [operations.processor.js](operations.processor.js.html) - module to process the various file operations for the project generation.
// * [print.js](print.js.html) - simple wrapper for the console.log at the moment but can be improved for better outputs;
// * [prompt.wrapper.js](prompt.wrapper.js.html) - prompt wrapper to be able to use or implement a different prompt;
// * [template.engine.js](template.engine.js.html) - for the file generation and path resolution, a template engine is used. Currently, Nunjucks is used.

module.exports = {
  cli: ioc.create('cli'),
  version: require('../package').version
};
