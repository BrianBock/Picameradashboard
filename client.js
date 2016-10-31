var WebSocket     = require('ws');
var ws            = new WebSocket('ws://localhost:3000/', {
  headers: {
    'x-pi-id': 'my-pi'
  }
});
var logger        = require('./helpers/logger');
var comm          = require('./helpers/comm')(ws); // include the communication tool
var handleMessage = require('./handle-message')(comm); // function for calling the client-side functions on the pi

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
  data = comm.receive(data);

  try {
    handleMessage(data, flags);
  }
  catch(err) {
    comm.send('error', comm.error(err));
  }
});