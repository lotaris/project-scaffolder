var
  buffertools = require('buffertools'),
  fs = require('fs-more'),
  ibfs = require('isbinaryfile');

beforeEach(function() {
  this.addMatchers({
    toHaveSameContent: function(expected) {
      var actualPath = this.actual,
          expectedPath = expected,
          isNot = this.isNot;

      var actualPathExists = fs.existsSync(actualPath);
      var expectedPathExists = fs.existsSync(expectedPath);

      if (!actualPathExists && !expectedPathExists) {
        this.message = function() {
          return "The expected file '" + expectedPath + "' and the actual file '" + actualPath + "' are missing.";
        };
        return false;
      }
      else if (actualPathExists && !expectedPathExists) {
        this.message = function() {
          return "The expected file '" + expectedPath + "' is missing during the actual file '" + actualPath + "' is present.";
        };
        return false;
      }
      else if (!actualPathExists && expectedPathExists) {
        this.message = function() {
          return "The expected file '" + expectedPath + "' is present during the actual file '" + actualPath + "' is missing.";
        };
        return false;
      }

      if (ibfs(expectedPath) && !ibfs(actualPath)) {
        this.message = function() {
          return "The content of expected file '" + expectedPath + "' is binary when the actual file '" + actualPath + "' is not binary.";
        };
        return false;
      }
      else if (!ibfs(expectedPath) && ibfs(actualPath)) {
        this.message = function() {
          return "The content of expected file '" + expectedPath + "' is not binary when the actual file '" + actualPath + "' is binary.";
        };
        return false;
      }
      else if (ibfs(expectedPath) && ibfs(actualPath)) {
        var expectedBinaryContent = fs.readFileSync(expectedPath);
        var actualBinaryContent = fs.readFileSync(actualPath);

        var comparison = buffertools.compare(actualBinaryContent, expectedBinaryContent);

        if (comparison > 0) {
          this.message = function() {
            return "The expected file size for '" + expectedPath + "' is bigger than the actual binary file size for '" + actualPath + "'.";
          };
          return false;
        }
        else if (comparison < 0) {
          this.message = function() {
            return "The expected file size for '" + expectedPath + "' is smaller than the actual binary file size for '" + actualPath + "'.";
          };
          return false;
        }

        return true;
      }
      else {
        var expectedContent = fs.readFileSync(expectedPath).toString().split("\n");
        var actualContent = fs.readFileSync(actualPath).toString().split("\n");

        if (expectedContent.length < actualContent.length) {
          var linesMissing = "";

          for (i = expectedContent.length - 1; i < actualContent.length; i++) {
            linesMissing += actualContent[i] + "\n";
          }

          this.message = function() {
            return "The content of expected file '" + expectedPath + "' is missing few lines regarding the actual file '" + actualPath + "'." +
              "\n\nPresent in actual file and not in expected:\n" +
              linesMissing;
          };

          return false;
        }
        else if  (expectedContent.length > actualContent.length) {
          var linesInAddition = "";

          for (i = actualContent.length - 1; i < expectedContent.length; i++) {
            linesInAddition += expectedContent[i] + "\n";
          }

          this.message = function() {
            return "The content of expected file '" + expectedPath + "' has few additional lines regarding the actual file '" + actualPath + "'." +
              "\n\nPresent in expected file and not in actual:\n" +
              linesInAddition;
          };

          return false;
        }
        else {
          var differentLines = [];

          for (i = 0; i < actualContent.length; i++) {
            if (actualContent[i] !== expectedContent[i]) {
              differentLines.push({
                line: i + 1,
                actual: actualContent[i],
                expected: expectedContent[i]
              });
            }
          }

          if (differentLines.length > 0) {
            var lines = "";

            for (i = 0; i < differentLines.length; i++) {
              lines +=
                "Line " + differentLines[i].line + ":\n" +
                "Actual:   " + differentLines[i].actual + "\n" +
                "Expected: " + differentLines[i].expected + "\n\n";
            }

            this.message = function() {
              return "The content of expected file '" + expectedPath + "' differs from the actual file '" + actualPath + "'." +
                "\n\nDifferences:\n" +
                lines;
            };

            return false;
          }
        }

        return true;
      }
    }
  });
});
