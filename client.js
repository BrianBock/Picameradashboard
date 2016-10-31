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

  if (_.isBoolean(response)) {
    generatedData.response = response;
  }
  else {
    generatedData.response = false;

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
};

/**
 * generates a simple bash command
 * 
 * @param cmd   string - the main command
 * @param addon string - anything tacked on after the command (flags, params, etc)
 * @param cb    fn     - the callback
 */
var runSingleCommand = function(cmd, addon, cb) {
  var generatedCmd = "if hash "+cmd+" 2>/dev/null; then "+cmd+" "+addon+"; else echo \"not_found\"; fi;";

  runBash(generatedCmd, function(err, data) {
    if (data.output === "not_found") {
      logger.log('info', 'Command not found: %s', cmd);

      cb(new Error('Command not found: %s', cmd));
    }
    else {
      data.cmd = cmd;
      data.addon = addon;
      data.generated_cmd = generatedCmd;

      cb(null, data);
    }
  });
}

/**
 * Runs a the given string in bash
 *
 * @param cmd string
 * @param cb  function
 */
var runBash = function(cmd, cb) {
  try {
    bash.get(cmd, function(output) {
      cb(null, {
        "cmd": cmd,
        "output": data
      });
    });
  }
  catch (err) {
    logger.log('error', 'Error running %s: %s', cmd, err.toString());
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

  // try {
    var response = handleMessage(data, flags);
    
    // if (response)
    //   send(message(response));
  // }
  // catch(err) {
  //   send(message(err));
  // } 
});