var _ = require('lodash');
var winston = require('winston');
var WebSocket = require('ws');
var cmd = require('node-cmd');

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

  error.message = message;

  if (!_.isUndefined(code))
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

  generatedData.response = response;

  if (_.isString(type)) {
    generatedData.type = type;
  }

  if (_.isUndefined(results) && !_.isString(type)) {
    results = type;
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

  return JSON.stringify(generatedData);
};

/**
 * Runs a the given command in bash
 *
 * @param cmd string
 * @param cb  function
 */
var runCommand = function(cmd, cb) {
  try {
  cmd.get("if hash raspistill 2>/dev/null; then raspistill -o "+name+"; else echo \"error\"; fi;",
    function(output) {
      if (output === "error") {
        logger.log('debug', 'Error running command: %s', cmd);

        cb(new Error('Error running command: %s', cmd));
      }
      else {
        cb(null, {
          "cmd": cmd,
          "output": data
        });
      }
    }
  );
  }
  catch (err) {
    logger.log('error', err.toString());
    cb(err);
  }
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

  
});