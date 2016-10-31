var _ = require('lodash');
var winston = require('winston');
var WebSocket = require('ws');
var cmd = require('node-cmd');
var ws = new WebSocket('ws://localhost:3000/', {
  headers: {
    'x-pi-id': 'my-pi'
  }
});

winston.handleExceptions(new winston.transports.File({ filename: 'log/exceptions.log' }))
winston.add(winston.transports.File, { filename: 'logs/general.log' });

var message = function(message) {
  return {
    "message": message
  };
};

var error = function (message, code) {
  var error = {};

  error.message = message;

  if (!_.isUndefined(code))
    error.code = code;

  return error;
};

var receive = function(data) {
  winston.log('info', 'Received message', data, {});
  return JSON.parse(data);
};

// @param response bool
// @param type bool optional
// @param data object optional
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

ws.on('open', function open() {
  console.log('connected');
  ws.send('hello from the client');
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function message(data, flags) {
  data = receive(data);

  if (data.hasOwnProperty('cmd') && data.cmd == 'take-still') {
    console.log('take a picture');
    var name = (data.name || new Date().getTime()+'.jpg');
    cmd.get(
        'if hash raspistill 2>/dev/null; then raspistill -o '+name+' else echo "false" fi',
        function(data){
          if (data == false) {
            console.log('failed to take picture');
          }
          else {
            console.log('took picture: '+name);
          }
        }
    );
  }
});