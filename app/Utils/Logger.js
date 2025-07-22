import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, simple } = format;

// ensure log folder exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// your custom line‐printer
const logFormat = printf(({ level, message, timestamp }) =>
  `${timestamp} [${level.toUpperCase()}] ${message}`
);

const Logger = createLogger({
  // capture everything at debug level or higher
  level: 'debug',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    // all "info" and above go to info.log
    new transports.File({
      filename: path.join(logDir, 'info.log'),
      level: 'info'
    }),
    // only "error" go to error.log
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    // console shows debug+ (useful during development)
    new transports.Console({
      level: 'debug',
      format: simple()
    }),
  ],
});

export default Logger;
