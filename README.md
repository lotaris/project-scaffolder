# project-scaffolder

> Create project from templates with cool templating capabilities to replace variables in files and paths.

**[Installation](#installation) &mdash; [Documentation](#documentation) &mdash; [Contributing](#contributing) &mdash; [License](#license)**


<a name="installation"></a>
## Installation

To start to use `Project Scaffolder`, you should first create a `npm` module with its `package.json`.

Then, You should create:

  * A folder `template` which will contain your project template files
  * A configuration file `scaff.yml` which contains the configuration of your template

```
projectFolder
  |- package.json
  |- scaff.yml
  |- template/
```

At this stage, you will be able to install the module `project-scaffolder`.

```
npm install --save project-scaffolder
```

<a name="documentation"></a>
## Documentation

This README is the main usage documentation.

`Project Scaffolder` uses external libraries to provide some of its functionality; refer to their documentation for more information:

* [Promises with the q library](https://github.com/kriskowal/q)

The source code is also heavily commented and run through [Docker](https://github.com/jbt/docker), so you can read the resulting [**annotated source code**][annotated-source] for more details about the implementation.

Check the [CHANGELOG](CHANGELOG.md) for information about new features and breaking changes.

## Usage

<a name="toc"></a>

* [Examples](#examples)
  * [First example](#first-example)
  * [Second example](#second-example)
* [How to create a project template](#how-to-create-project-template)
* [How to override config file and template folder](#how-to-override-config-folder)
* [How to write the configuration file](#how-to-wraite-config-file)

## Examples

Before going in the details, let's take a look to some examples.

<a name="first-example"></a>
### First project template example

In order to generate a new project based on a template, you should prepare that template. Let's start with a basic example.

Our template project (you can take a look to the [First example][first-example].) has the following content:

```
examples/first/
  |- package.json
  |- scaff.yml
  |- template/
       |- templateFile.txt
```

The resulting project from that template will be:

```
results/first/
  |- templateFile.txt
```

In fact, the content of the `templateFile.txt`

```
Welcome {{ username }}!
```

will become (if the username has the value `John`):

```
Welcome John!
```

To get that result, we use the following commands and we give the answer `John` to the question and also an output folder to store the generated content.

```bash
$> cd <projectTemplatePath>
$> project-scaffolder
prompt: Enter your username:  John
prompt: finally the output directory (will be created if not existing):  <outputFolder>
Project configuration:
  username: John
```

Then you can see the [result][first-result].

<a name="second-example"></a>
### Second project template example

In the second example, we will see an example that use also filtering into the file paths.

Our template project (you can take a look to the [Second example][second-example].) has the following content:

```
examples/second/
  |- package.json
  |- scaff.yml
  |- template/
       |- __subPath__/
            |- templateFile.txt
```

The resulting project from that template will be (if subpath value is `one/two/three`):

```
destination/folder/
  |- one/
       |- two/
            |- three/
                 |- templateFile.txt
```

In fact, the content of the `templateFile.txt`

```
Welcome {{ username }}!
```

will become (if the username has the value `John`):

```
Welcome John!
```

To get that result, we use the following commands and we give the answer `John` to the question and also an output folder to store the generated content.

```bash
$> cd <projectTemplatePath>
$> project-scaffolder
prompt: Enter your username:  John
prompt: Enter the sub path:  one/two/three
prompt: finally the output directory (will be created if not existing):  <outputFolder>
Project configuration:
  username: John
  subPath: one/two/three
```

Then you can see the [result][second-result].

<a name="how-to-create-project-template"></a>
## How to create a project

Based on the previous examples, you see that your project template need to contains several elements that are used to generate your project from your template.

* `package.json` Define your `npm` module to allow using `project-scaffolder` in a specific version for your project template;
* `scaff.yml` where you will store the configuration to be prompt to your template user (and later on, additional project template properties that can be used in the template generation proecss);
* `template` the folder where your template files are stored. The content of this folder will be processed and filtered to generate your project.

The files stored in the template folder can be:

* `text` files that will be handled by templating engine to apply the filtering;
* `binary` file that will be simply copy from the project template to the project generated.

During the generation process, each `text` files will be given to [Nunjucks][nunjucks] which is the template engine used in `project-scaffolder`. This template engine is based on [Jinja](http://jinja.pocoo.org/) template engine. Then the syntax is quite similar and the possiblity to use filters is there. It means that you can be able to write something like that in your template files:

```
{{ someVariable | upper }}
```

which will result to (if someVariable value is "John"):

```
JOHN
```

The same possibility is available to filter the paths but there, we need a different syntax.

The syntax for variable replacement and filtering is the following:

```
__variableName__

and

__variableName-filterName__
```

The limitation of that syntax is that you cannot use `-` in the variable name or the filter name.

<a name="#how-to-override-config-folder"></a>
## How to override the template config file and the template folder

By default, the `scaff.yml` and `template` folder are mandatory in a template project but you have the possibility to use a custom folder path and a custom configuration file.

For that, you have to use environment variables when you invoke `project-scaffolder`.

```bash
$> SCAFF_TEMPLATE_CONFIG_FILE=some/great/path/to/config.yml SCAFF_TEMPLATE_FOLDER=some/greate/to/project/template project-scaffolder
```

You can use only one of these options if you want.

<a name="how-to-wraite-config-file"></a>
## How to write a configuration file

First, you need to create the file `scaff.yml` at the root of your template project.

Now, you are able to write something like that:

```yml
prompt:
  properties:
    propertyName:
      message: Some message there
      required: true
      default: some default value

extras:
  - extra-module
```

### The `prompt.properties` configuration

This configuration section defines the questions that will be asked when the command `project-scaffolder` is run in the template project.

As the `project-scaffolder` use the module [`prompt`](https://www.npmjs.org/package/prompt) to present the command line user interface, you can define the options as described in `prompt` documentation.

There is only one exception which do not allow to use `before`.

Then you can define a command line question like that:

```yml
propertyName:
  description: String
  type: String
  pattern: RegExp
  message: String
  hidden: true|false
  default: String
  required: true|false
```

**Note**: The property name will be used as placeholder name during the templating process. Example:

```yml
package:
  description: Define the root package for java classes
  required: true
  default: com.some.where
```

and one template somewhere:

```java
package {{ package }}.else;

public class {
}
```

which will produce that result if the default value is used:

```java
package com.some.where.else;

public class {
}
```

### The `extras` configuration

This configuraiton section allow to load more modules for [`Nunjucks`][nunjucks] to enrich `filters` and `tags`.

The module names specified in the list should be installed in the project as usual via `npm`.

The modules must follow the requirements explained in [`project-scaffolder-extras`][pse]

In summary, extra module must expose an object which contains the following structure:

```javascript
module.syncFilters = {
  syncFilterName: function(arg1, arg2, ...) {
    ...
    return ...;
  }
};

module.asyncFilters = {
  asyncFilterName: function(arg1, arg2, callback) {
    ...
    callback(err, res);
  }
};

module.syncTags = {
  syncTagName: function(...) { 
    ...
    return ...;
  }
};

module.asyncTags = {
  asyncTagName: function(..., callback) {
    ...
    callback(err, res);
  }
};
```

You can also have this syntax:

```javascript
module.filtersSync = {};
module.filtersAsync = {};
module.tagsSync = {};
module.tagsAsync = {};
```

You should carefully read the documentation of `Nunjucks` to know how to write filters and tags (synchronous vs. asynchronous).

**Note:** Currently, the asynchronous filters are not supported for the filtering process done in file paths of the template.

## Contributing

* [Fork](https://help.github.com/articles/fork-a-repo)
* Create a topic branch - `git checkout -b feature`
* Push to your branch - `git push origin feature`
* Create a [pull request](http://help.github.com/pull-requests/) from your branch

Please add a changelog entry with your name for new features and bug fixes.

## License

Project Scaffolder is licensed under the [MIT License](http://opensource.org/licenses/MIT).
See [LICENSE.txt](LICENSE.txt) for the full text.

[annotated-source]: http://lotaris.github.io/project-scaffolder/annotated/index.js.html
[first-example]: https://github.com/lotaris/project-scaffolder/tree/master/examples/sources/first-example
[first-result]: https://github.com/lotaris/project-scaffolder/tree/master/examples/results/first-example
[second-example]: https://github.com/lotaris/project-scaffolder/tree/master/examples/sources/second-example
[second-result]: https://github.com/lotaris/project-scaffolder/tree/master/examples/results/second-example
[nunjucks]: http://mozilla.github.io/nunjucks/
[pse]: https://github.com/lotaris/project-scaffolder-extras
