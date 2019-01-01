import * as path from 'path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { fileFormat, consoleFormat } from './winstonFormat';

import configJson = require('../settings/config.json'); // tslint:disable-line //

const dailyRotateFileOpts = configJson.dailyRotateFile;

const optsForDailyRotateFile = {
  level: configJson.level,
  format: fileFormat,
  filename: dailyRotateFileOpts.filename,
  dirname: path.resolve(configJson.pathToLogs, 'daily'),
  datePattern: dailyRotateFileOpts.datePattern,
  zippedArchive: dailyRotateFileOpts.zippedArchive,
  maxSize: dailyRotateFileOpts.maxSize,
  maxFiles: dailyRotateFileOpts.maxFiles
} as DailyRotateFile.DailyRotateFileTransportOptions;

const dailyRotate = new DailyRotateFile(optsForDailyRotateFile);

const transports = [
  // wite normal messages to rotating log file
  dailyRotate,
  // wite error messages to separate log file
  new winston.transports.File({
    format: fileFormat,
    filename: path.resolve(configJson.pathToLogs, 'errors.log'),
    level: 'error'
  }),
  // wite all messages to console
  new winston.transports.Console({
    format: consoleFormat,
    level: 'silly'
  })
];

export default transports;
