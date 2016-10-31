var _ = require('lodash');
var winston = require('winston');
var WebSocket = require('ws');
var bash = require('node-cmd');
var handleMessage = require('./handle-message');

// connect  to server
var ws = new WebSocket('ws://localhost:3000/', {
  headers: {
    'x-pi-id': 'my-pi'
  }
});

// configure logger
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ colorize: true }),
    new (winston.transports.File)({
      name: 'general-file',
      filename: 'logs/general.log',
      level: 'info'
    }),
  ]
});

logger.handleExceptions(new winston.transports.File({ filename: 'logs/uncaught-exceptions.log' }));
logger.handleExceptions(new winston.transports.Console({ colorize: true }));


/** 
 * Generate a message
 */
var message = function(message) {
  return {
    "message": message
  };
};

/** 
 * Generate a error
 */
var error = function (message, code) {
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
var receive = function(data) {
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
var send = function(response, type, data) {
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
  logger.log('info', 'Sent message', data);
};

/**
 * Listen for connection to server
 */
ws.on('open', function open() {
  logger.log('debug', 'Connected to server');
});

/**
 * Listen for disconnection to server
 */
ws.on('close', function close() {
  logger.log('debug', 'Disconnected from server');
});

/**
 * Listen for messages from the server
 */
ws.on('message', function message(data, flags) {
  data = receive(data);

  try {
    handleMessage(data, flags, send, function(err, response) {
      if (err) {
        send(true, 'error', error(err));
      }
      else if (response) {
          send(true, message(response));
      }
    });
  }
  catch(err) {
    send(true, 'error', error(err));
  } 
});