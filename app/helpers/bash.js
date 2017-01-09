var logger = require('./logger');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

/**
 * generates a simple bash command
 * 
 * @param cmd   string - the main command
 * @param addon string - anything tacked on after the command (flags, params, etc)
 * @param cb    fn     - the callback
 */
var single = function(cmd, addon, cb) {
  var generatedCmd = "if hash "+cmd+" 2>/dev/null; then "+cmd+" "+addon+"; else echo \"not_found\"; fi;";

  run(generatedCmd, function(err, data) {
    if (err) 
      return cb(err);

    if (data.output.indexOf("not_found") >= 0) {
      logger.log('debug', 'Command not found: %s', cmd);

      cb(new Error('Command not found: %s', cmd));
    }
    else {
      data.cmd = cmd;
      data.addon = addon;
      data.generated_cmd = generatedCmd;

      cb(null, data);
    }
  });
}

/**
 * Runs a the given string in bash
 *
 * @param cmd string
 * @param cb  function
 */
var run = function(cmd, cb) {
  try {
    exec(cmd, function(err, stdout, stderr) {
      logger.log('debug', 'Ran command: %s', cmd);

      if (err) {
        return cb(err);
      }

      if (stderr) {
        return cb(stderr);
      }

      return cb(null, {
        "cmd": cmd,
        "output": stdout
      });
    });
  }
  catch (err) {
    logger.log('error', 'Error running %s: %s', cmd, err.toString());
    cb(err);
  }
};

var stream = function(cmd, cb) {
  var results = spawn(cmd);

  results.stdout.on('data', function(data) {
    cb(null, {
      "output": data
    });
  });

  results.stderr.on('data', function(data) {
    cb(data);
  });

  results.on('close', function(code) {
    cb(null, {
      "close": true,
      "code": code,
      "output": "Process exited with code: "+code
    });
  })
}

module.exports = {
  run: run,
  single: single,
  stream: stream
};
