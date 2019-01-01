declare var process: any;

import * as mongoose from 'mongoose';
import { default as log } from '../logger/logger';

import { requiredVal, prefixOfENV } from '../config/confHelper';

import { DbSettings, DbConnection } from './mongoutils';

const env = process.env;

let lastDbConnection: DbConnection;

const dbSettings = {
  dbType: env.DB_TYPE || requiredVal('DB_TYPE'),
  dbHostname: env[`${prefixOfENV}_DB_HOSTNAME`] || requiredVal(`${prefixOfENV}_DB_HOSTNAME`),
  dbPort: env[`${prefixOfENV}_DB_PORT`] || requiredVal(`${prefixOfENV}_DB_PORT`),
  dbName: env[`${prefixOfENV}_DB_NAME`] || requiredVal(`${prefixOfENV}_DB_NAME`),
  dbUser: env[`${prefixOfENV}_DB_USERNAME`] || requiredVal(`${prefixOfENV}_DB_USERNAME`),
  dbPass: env[`${prefixOfENV}_DB_PASSWORD`] || requiredVal(`${prefixOfENV}_DB_PASSWORD`),
} as DbSettings;

function connectDatabase(dbConnection: DbConnection) {
  lastDbConnection = dbConnection;
  log.info(`trying connect to ${dbConnection.uri}`);

  return new Promise((resolve, reject) => {
    mongoose.connect(
      dbConnection.uri,
      dbConnection.options,
      (err) => {
        if (err) {
          log.info(`NOT connected to mongodb`);
          log.error('err: %o', err);
          reject(err);
        }
        log.info(`connected to mongodb`);
        log.info(`running in mode: ${process.env.NODE_ENV}`);
        log.info(`Mongoose connection has been established to ${dbConnection.uri}`);
        resolve(dbConnection);
      }
    );
  });
}

/* events with connection */
mongoose.connection.on('connecting', () => log.info('connecting to MongoDB...'));
mongoose.connection.on('reconnected', () => log.info('MongoDB reconnected!'));
mongoose.connection.on('connected', () => log.info('Mongoose is connected'));

mongoose.connection.once('open', () => log.info('MongoDB connection opened!'));

mongoose.connection.on('disconnected', () => {
  log.info('Mongoose connection is disconnected');
  setTimeout(function() {
    connectDatabase(lastDbConnection);
  // tslint:disable-next-line:align
  }, lastDbConnection.options.reconnectInterval || 15000);
});

mongoose.connection.on('error', (err) => {
  log.error('Mongoose connection error: %o', err);
  mongoose.disconnect();
});

// do something when app is closing
process.on('exit', () => {
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to exit'));
});

// catches ctrl+c event
process.on('SIGINT', () => {
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to SIGINT'));
});

// catches 'kill pid' (for example: nodemon restart)
process.on('SIGUSR1', () => {
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to SIGUSR1'));
});

process.on('SIGUSR2', () => {
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to SIGUSR2'));
});

// catches uncaught exceptions
process.on('unhandledRejection', function(reason: any, p: any) {
  log.error(`%o Unhandled Rejection at Promise %o`, reason, p);
  // info(reason, 'Unhandled Rejection at Promise', p);
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to unhandledRejection'));
});

process.on('uncaughtException', function(err: any) {
  log.error(`'Uncaught Exception thrown %o`, err);
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to uncaughtException'));
});

export { connectDatabase, dbSettings };
