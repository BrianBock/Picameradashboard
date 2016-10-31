require('app-module-path').addPath(__dirname + '/app');
require('dotenv').config();

var _             = require('lodash');
var logger        = require('helpers/logger');
var io            = require('socket.io-client');
var socket        = io(process.env.SERVER_URL, { extraHeaders: { 'x-client-id': process.env.CLIENT_ID, 'x-commands': _.keys(require('commands')()) } });
var comm          = require('helpers/comm')(socket, logger); // include the communication tool
var commands     = require('commands')(comm);

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
socket.on('command', function (data) {
  if (!_.has(data, 'command'))
    return comm.error('No command given.');

  try {
    if (_.has(commands, data['command']) && _.isFunction(command[data['command']])) {
      return commands[data['command']](data);
    }
    else {
      throw Error('Command not found: '+data['command']);
    }
  }
  catch(err) {
    comm.error(err);
  }
});