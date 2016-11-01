var _  = require('lodash');

module.exports = function(socket, logger) {
  var send = {};

  var isResponseDefault = true;
  var setDefault = function(original, fallback) {
    return typeof _.isUndefined(original) ? fallbakc : original;
  }

  /** 
   * Send a message
   */
  send['status'] = function(status, decription, isResponse) {
    isResponse = setDefault(isResponse, isResponseDefault);

    if (_.isBoolean(description)) {
      isResponse = description;
    }

    var data = {
      "status": status
    };

    if (_.isString(description))
      data["description"] = description;

    send.data('status', data, isResponse);
  };

  /** 
   * Send a message
   */
  send['message'] = function(message, isResponse) {
    isResponse = setDefault(isResponse, isResponseDefault);

    send.data('message', {
      "message": message
    }, isResponse);
  };

  /** 
   * Send a error
   */
  send['error'] = function (errors, code, isResponse) {
    isResponse = setDefault(isResponse, isResponseDefault);

    if (_.isBoolean(code)) {
      isResponse = code;
      code = undefined;
    }

    if (_.isUndefined(code)) {
      code = 0;
    }

    if (!_.isArray(errors)) {
      errors = [{
        message: errors.toString(),
        code: code
      }];
    }

    _.forEach(errors, function(error, index) {
      if (_.isString(error) || _.isError(error)) {
        errors[index] = {
          message: error.toString(),
          code: code
        };
      }
    });

    send.data('error', {
      errors: errors
    }, isResponse);
  };

  /**
   * Returns a string of JSON data to send to the server
   *
   * @param type     bool optional
   * @param data     object
   * @param isResponse bool optional
   */
  send['data'] = function(type, data, isResponse) {
    isResponse = setDefault(isResponse, isResponseDefault);

    var generatedData = {};

    if (!_.isString(type)) {      
      isResponse = _.isBoolean(data) ? data : isResponse;
      data = type;
      type = 'data';
    }

    generatedData.type = type;
    generatedData.isResponse = isResponse;

    logger.log('debug', 'Sending %s...', type);

    if (!_.isUndefined(data)) {
      _.merge(generatedData, data);
    }
    else {
      logger.log('debug', 'Data is required');

      throw Error('Data is required');
    }

    socket.emit(type, generatedData);
    logger.log('info', 'Sent %s: %s', type, JSON.stringify(generatedData));
  };

  return send;
};
