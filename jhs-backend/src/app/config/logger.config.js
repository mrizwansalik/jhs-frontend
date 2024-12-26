const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, json } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'src/log/log-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [fileRotateTransport],
});

// export logger configuration
module.exports = logger
