var _ = require('underscore'),
    cliFactory = require('../../lib/cli.js');

describe("Cli", function() {
  var scaffolder;
  var Cli;
  var run;
  var cliEnv = {};

  beforeEach(function() {
    run = jasmine.createSpy('run');

    scaffolder = function() {
      return {
        run: run
      };
    };

    Cli = cliFactory(scaffolder, cliEnv);
  });

  it("Running exectute should call the scaffolder", function() {
    var q = jasmine.createSpyObj('q', ['done']);

    run.andCallFake(function() {
      return q;
    });

    var cli = new Cli();

    spyOn(cli, 'loadEnvironmentOptions').andCallThrough();

    cli.execute();

    expect(cli.loadEnvironmentOptions).toHaveBeenCalled();
    expect(run).toHaveBeenCalled();
    expect(q.done).toHaveBeenCalled();
  });

  it("Template configuration file and template folder can be set from the environment variables", function() {
    cliEnv.SCAFF_TEMPLATE_CONFIG_FILE = 'templateConfigFile';
    cliEnv.SCAFF_TEMPLATE_FOLDER = 'templateFolder';
    cliEnv.WHATEVER_OPTION = "something";

    var options = new Cli().loadEnvironmentOptions();

    expect(options).toBeDefined();
    expect(_.keys(options).length).toEqual(2);
    expect(options.WHATEVER_OPTION).toBeUndefined();

    expect(options.templateConfigFile).not.toBeNull();
    expect(options.templateConfigFile).toEqual('templateConfigFile');

    expect(options.templateFolder).not.toBeNull();
    expect(options.templateFolder).toEqual('templateFolder');
  });
});
