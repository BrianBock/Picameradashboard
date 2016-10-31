var _ = require('lodash');
var bash = require('./bash');
var commands = {};

module.exports = function(data, flags, cb) {
  if (_.has(data, 'cmd')) {
    if (_.has(commands, data['cmd']) && _.isFunction(commands, data['cmd'])) {
      return commands[data['cmd']](data, cb);
    }
    else {
      throw Error('Command not found: '+data['cmd']);
    }
  }
};

///////////////////////////////
// WRITE YOUR FUNCTIONS HERE //
///////////////////////////////

commands['take-still'] = function(data, cb) {
  var name = data.name || new Date.toString() + '.jpg';

  bash.single('raspistill', '-o '+name, function(err, output) {
    cb('')
  });
};