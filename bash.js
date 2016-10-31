module.exports = {
  run: run,
  single: single
};

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
      cb(err);

    if (data.output === "not_found") {
      logger.log('info', 'Command not found: %s', cmd);

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
    bash.get(cmd, function(output) {
      cb(null, {
        "cmd": cmd,
        "output": data
      });
    });
  }
  catch (err) {
    logger.log('error', 'Error running %s: %s', cmd, err.toString());
    cb(err);
  }
};