var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      level: process.env.LOG_LEVEL || 'info'
    }),
    new (winston.transports.File)({
      name: 'general-file',
      filename: 'logs/general.log',
      level: process.env.LOG_LEVEL || 'info'
    }),
  ]
});

logger.handleExceptions(new winston.transports.File({ filename: 'logs/uncaught-exceptions.log' }));
logger.handleExceptions(new winston.transports.Console({ colorize: true }));

module.exports = logger;