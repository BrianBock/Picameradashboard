var _          = require('lodash');
var bash       = require('./helpers/bash');
var logger     = require('./helpers/logger');
var functions  = {};
module.exports = function(comm) {

  ///////////////////////////////
  // WRITE YOUR FUNCTIONS HERE //
  ///////////////////////////////



  functions['take-still'] = function(data) {
    var name = data.name || new Date().getTime() + '.jpg';

    bash.single('raspistill', '-o '+name, function(err, output) {
      if (err)
        return comm.send('error', comm.error("Looks like the command `respstill` doesn't exist on this pi"));

      return comm.send(comm.message(output));
    });
  };



  ///////////////////////////////
  //  END YOUR FUNCTIONS HERE  //
  ///////////////////////////////

  var handleMessage = function(data, flags) {
    if (_.has(data, 'cmd')) {
      if (_.has(functions, data['cmd']) && _.isFunction(functions[data['cmd']])) {
        return functions[data['cmd']](data);
      }
      else {
        throw Error('Function not found: '+data['cmd']);
      }
    }
  };


  return handleMessage;
};