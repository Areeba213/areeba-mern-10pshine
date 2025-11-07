const pinoHttp = require('pino-http');
const logger = require('../logger');

const loggerMiddleware = pinoHttp({
  logger: logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        referer: req.headers['referer']
      }
    }),
    res: (res) => ({
      statusCode: res.statusCode
    }),
    err: (err) => ({
      type: err.type,
      message: err.message,
      stack: err.stack
    })
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  }
});

module.exports = loggerMiddleware;