var _    = require('lodash');
var bash = require('helpers/bash');

module.exports = function(comm) {
  var _commands = {};

  function register(name, fn) {
    if (comm) {
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
        return comm.error("Looks like the command `respstill` doesn't exist on this pi");

      return comm.message(output);
    });
  });


  register('run-bash', function(data) {
    var bash = data.params.bash;

    bash.run(bash, function(err, result) {

    });
  });

  //////////////////////////////
  //  END YOUR COMMANDS HERE  //
  //////////////////////////////
  
  return _commands;
};