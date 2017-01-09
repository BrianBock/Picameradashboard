var _  = require('lodash');

module.exports = function(socket, logger) {
  var send = {};

  /** 
   * Send update
   */
  send.update = function(update) {
    var data = {
      "type": "update",
      "update": update
    };

    socket.emit('update', data);
    logger.log('info', 'Sent update: %s', JSON.stringify(data));
  };

  /** 
   * Send a message
   */
  send.message = function(message) {

    message = _.isString(message) ? message : JSON.stringify(message);

    send.data('message', {
      "message": message
    });
  };

  /** 
   * Send a console message
   */
  send.log = function(log) {

    log = _.isString(log) ? log : JSON.stringify(log);

    send.data('log', {
      "output": log
    });
  };

  /** 
   * Send a exception
   */
  send.exception = function (exception, code) {

    if (_.isUndefined(code)) {
      code = 0;
    }

    send.data('exception', {
      message: exception.toString(),
      code: code
    });
  };

  /**
   * Returns a string of JSON data to send to the server
   *
   * @param type     bool optional
   * @param data     object
   */
  send.data = function(type, data) {

    var generatedData = {};

    if (!_.isString(type)) {
      data = type;
      type = 'data';
    }

    generatedData.type = type;

    logger.log('debug', 'Sending %s...', type);

    if (!_.isUndefined(data)) {
      _.merge(generatedData, data);
    }
    else {
      logger.log('debug', 'Data is required');

      throw Error('Data is required');
    }

    socket.emit('data', generatedData);
    logger.log('info', 'Sent %s: %s', type, JSON.stringify(generatedData));
  };

  return send;
};
