const pino = require('pino');

// Development logger with pretty printing
const devLogger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Production logger
const prodLogger = pino({
  level: 'info'
}, pino.destination('./logs/app.log'));

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

module.exports = logger;