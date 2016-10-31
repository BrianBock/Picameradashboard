var _  = require('lodash');

module.exports = function(ws, logger) {
  var comm = {};

  /** 
   * Generate a message
   */
  comm['message'] = function(message) {
    return {
      "message": message
    };
  };

  /** 
   * Generate a error
   */
  comm['error'] = function (message, code) {
    var error = {};

    if (_.isError(message))
      message = message.toString();

    error.message = message;

    if (!_.isUndefined(code))
      code = 0;

    error.code = code;

    return error;
  };

  /**
   * Parse the given message from the server
   */
  comm['receive'] = function(data) {
    logger.log('info', 'Received message', data);
    try {
      return JSON.parse(data);
    }
    catch(err) {
      logger.log('error', 'Failed to parse message', data);
    }

    return {};
  };

  /**
   * Returns a string of JSON data to send to the server
   *
   * @param response bool
   * @param type     bool optional
   * @param data     object optional
   */
  comm['send'] = function(response, type, data) {
    var generatedData = {};

    if (_.isBoolean(response)) {
      generatedData.response = response;
    }
    else {
      generatedData.response = true;

      data = type;
      type = response;
    }

    if (_.isString(type)) {
      generatedData.type = type;
    }
    else {
      data = type;
    }

    if (!_.isUndefined(data)) {
      if (type === 'error') {
        if (!_.isArray(data))
          data = [data];

        generatedData.errors = data;
      }
      else {
        _.merge(generatedData, data);
      }
    }

    if (_.isUndefined(type) && _.isUndefined(data)) {
      logger.log('debug', 'Type and/or data is required');

      throw Error('Type and/or data is required');
    }

    ws.send(JSON.stringify(generatedData));
    logger.log('info', 'Sent message', JSON.stringify(generatedData));
  };

  return comm;
};
