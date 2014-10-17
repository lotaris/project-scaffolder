var ioc = require('../../lib/ioc.js'),
    configurationFactory = require('../../lib/config.js'),
    fs = require('fs-more'),
    print = require('../../lib/print.js'),
    _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    tmp = require('tmp-sync'),
    projectScaffolderFactory = require('../../lib/scaffolder.js');

describe("Scaffolder", function() {
  var inputs = [{
    groupId: 'com.forbesdigital',
    artifactIdPrefix: 'dummyArtifact',
    package: 'com.forbesdigital.dummy',
    mavenPathShortName: 'da',
    projectHumanName: 'Dummy Project',
    roxProjectKey: 'abcdefghij',
    userClassNamePrefix: 'Dummy',
    serverShortName: 'dum',
    contextRoot: 'du',
    initialVersion: '1.0.0',
    authorFirstName: 'Firstname',
    authorLastName: 'Lastname',
    authorEmail: 'firstname.lastname@localhost.localdomain',
    outputDirectory: tmp.in(path.resolve('/tmp'))
  }];

  var prompt = {
    start: jasmine.createSpy(),
    get: function(schema, callback) {
      callback(null, inputs.shift());
    }
  };

  var templateBaseDirectory = path.join('res', 'tempTemplateProject');
  var templateBasePath = path.join(templateBaseDirectory, 'template');
  var outputBaseDirectory = inputs[0].outputDirectory;
  var resultBaseDirectory = path.join('res', 'resultTemplateProject');

  var scaffolder;

  beforeEach(function() {
    var ProjectScaffolder = projectScaffolderFactory();

    scaffolder = new ProjectScaffolder();

    spyOn(scaffolder, 'buildConfiguration').andCallFake(function() {
      var TemplateEngine = require("../../lib/template.engine.js")(require('nunjucks'), require('fs-more'), {
        require: function(name) {
          return {
            syncFilters: {
              folderize: function(pkg) {
                return pkg.replace(/\./g, path.sep);
              }
            }
          };
        }
      });

      var Configuration = configurationFactory(prompt, print, fs);

      scaffolder.config = new Configuration({
        templateEngine: new TemplateEngine(),
        templateConfigFile: path.join(templateBaseDirectory, 'scaff.yml'),
        templateFolder: templateBasePath
      });
    });
  });

  function countFile(baseDirectory, directory) {
    var nbFiles = 0;

    _.each(fs.readdirSync(path.join(baseDirectory, directory)), function(file) {
      if (fs.statSync(path.join(baseDirectory, directory, file)).isFile()) {
        nbFiles++;
      }
      else {
        nbFiles += countFile(baseDirectory, path.join(directory, file));
      }
    });

    return nbFiles;
  }

  function checkResult(directory) {
    _.each(fs.readdirSync(path.join(resultBaseDirectory, directory)), function(file) {
      if (fs.statSync(path.join(resultBaseDirectory, directory, file)).isFile()) {
        expect(path.join(outputBaseDirectory, directory, file)).toHaveSameContent(path.join(resultBaseDirectory, directory, file));
      }
      else {
        checkResult(path.join(directory, file));
      }
    });
  }

  it("Generating a project from a template should produce the expected result with all the filtering applied", function() {
    var scaffolderSpy = jasmine.createSpy();

    try {
      scaffolder.run().then(scaffolderSpy, function(e) {
        console.log(e.message);
      });
    }
    catch (e) {
      console.log(e.message);
    }

    waitsFor(function() {
      return scaffolderSpy.calls.length;
    }, "scaffolderSpy should have been called", 1000);

    runs(function() {
      var templateNumberOfFiles = countFile(templateBasePath, '');
      var resultNumberOfFiles = countFile(resultBaseDirectory, '');

      // expect(resultNumberOfFiles).toEqual(templateNumberOfFiles);

      checkResult('');
    });
  });
});
