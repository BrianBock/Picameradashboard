require('app-module-path').addPath(__dirname + '/app');
require('dotenv').config();

var _             = require('lodash');
var logger        = require('helpers/logger');
var io            = require('socket.io-client');
var socket        = io(process.env.SERVER_URL+'clients', { extraHeaders: { 'x-client-id': process.env.CLIENT_ID, 'x-commands': require('commands')().names() } });
var send          = require('helpers/send')(socket, logger); // include the communication tool
var commands      = require('commands')(send);

logger.log('debug', 'Starting client...');

/**
 * Listen for connection to server
 */
socket.on('connect', function () {
  logger.log('info', 'Connected to server');
});

socket.on('connect_error', function () {
  logger.log('info', 'Failed to connect to server');
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
socket.on('command', function (data) {
  if (!_.has(data, 'command'))
    return send.error('No command given.');

  try {
    commands.run(data['command'], data);
  }
  catch(err) {
    send.error(err);
  }
});