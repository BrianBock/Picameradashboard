require('app-module-path').addPath(__dirname + '/app');
require('dotenv').config();

var _             = require('lodash');
var logger        = require('helpers/logger');
var io            = require('socket.io-client');
var socket        = io(process.env.SERVER_URL, { extraHeaders: { 'x-client-id': process.env.CLIENT_ID, 'x-functions': _.keys(require('functions')()) } });
var comm          = require('helpers/comm')(socket, logger); // include the communication tool
var functions     = require('functions')(comm);

logger.log('debug', 'Starting client...');

/**
 * Listen for connection to server
 */
socket.on('connect', function () {
  logger.log('info', 'Connected to server');
});

/**
 * Listen for disconnection to server
 */
socket.on('disconnect', function () {
  logger.log('info', 'Disconnected from server');
});

/**
 * Listen for messages from the server
 */
socket.on('event', function (data) {
  // data = comm.receive(data);

  // try {
  //   if (_.has(data, 'cmd')) {
  //     if (_.has(functions, data['cmd']) && _.isFunction(functions[data['cmd']])) {
  //       return functions[data['cmd']](data);
  //     }
  //     else {
  //       throw Error('Function not found: '+data['cmd']);
  //     }
  //   }
  // }
  // catch(err) {
  //   comm.send('error', comm.error(err));
  // }
});