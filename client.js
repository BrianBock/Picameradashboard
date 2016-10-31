require('dotenv').config();

var _             = require('lodash');
var logger        = require('./helpers/logger');
var WebSocket     = require('ws');
var ws            = new WebSocket(process.env.SERVER_URL, { headers: { 'x-pi-secret-id': process.env.PI_SECRET_ID, 'x-functions': _.keys(require('./functions')()) } });
var comm          = require('./helpers/comm')(ws, logger); // include the communication tool
var functions     = require('./functions')(comm);
var handleMessage = require('./helpers/handle-message')(functions); // function for calling the client-side functions on the pi

/**
 * Listen for connection to server
 */
ws.on('open', function open() {
  logger.log('info', 'Connected to server');
});

/**
 * Listen for disconnection to server
 */
ws.on('close', function close() {
  logger.log('info', 'Disconnected from server');
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