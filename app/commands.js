var _    = require('lodash');
var bash = require('helpers/bash');

module.exports = function(send) {
  var _commands = {};

  function register(name, fn) {
    if (send) {
      _commands[name] = fn;
    }
    else {
      _commands[name] = null;
    }
  };

  //////////////////////////////
  // WRITE YOUR COMMANDS HERE //
  //////////////////////////////


  register('take-picture', function(data) {
    var name = data.params.name || new Date().getTime() + '.jpg';

    bash.single('raspistill', '-o '+name, function(err, output) {
      if (err)
        return send.error("Looks like the command `respstill` doesn't exist on this pi");

      return send.message(output);
    });
  });


  register('run-bash', function(data) {
    var bash = data.params.bash;
    send.status('working', 'Running bash command...');
    bash.run(bash, function(err, result) {
      send.message(result);
      send.status('online');
    });
  });

  //////////////////////////////
  //  END YOUR COMMANDS HERE  //
  //////////////////////////////

  var exists = function(name) {
    return (_.has(_commands, name) && _.isFunction(_commands, name));
  };

  var run = function(name, data) {
    if (exists(name)) {
      return commands[data['command']](data);
    }
    else {
      throw Error('Command not found: '+data['command']);
    }
  };

  var names = function() {
    return _.keys(_commands);
  }
  
  return {
    exists: exists,
    run: run,
    names: names
  };
};