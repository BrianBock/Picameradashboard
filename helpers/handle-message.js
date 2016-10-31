var _          = require('lodash');

module.exports = function(functions) {
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