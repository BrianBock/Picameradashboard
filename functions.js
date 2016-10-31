var _    = require('lodash');
var bash = require('./helpers/bash');

module.exports = function(comm) {
  var _functions = {};

  function register(name) {
    _functions[name] = null;
  };

  function set(name, fn) {
    if (comm) {
      if (_.has(_functions, name)) {
        _functions[name] = fn;
      }
      else {
        throw Error ('Function not registered.');
      }
    }
  };

  ///////////////////////////////
  // WRITE YOUR FUNCTIONS HERE //
  ///////////////////////////////


  register('take-still');
  set('take-still', function(data) {
    var name = data.name || new Date().getTime() + '.jpg';

    bash.single('raspistill', '-o '+name, function(err, output) {
      if (err)
        return comm.send('error', comm.error("Looks like the command `respstill` doesn't exist on this pi"));

      return comm.send(comm.message(output));
    });
  });


  register('take-video');

  ///////////////////////////////
  //  END YOUR FUNCTIONS HERE  //
  ///////////////////////////////
return _functions;
};