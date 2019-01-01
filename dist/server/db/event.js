"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = {
  info: function info() {
    return console.log;
  },
  error: function error() {
    return console.log;
  }
};
/* events with connection */

_mongoose.default.connection.on('connecting', function () {
  return log.info('connecting to MongoDB...');
});

_mongoose.default.connection.on('reconnected', function () {
  return log.info('MongoDB reconnected!');
});

_mongoose.default.connection.on('connected', function () {
  return log.info('Mongoose is connected');
});

_mongoose.default.connection.once('open', function () {
  return log.info('MongoDB connection opened!');
});

_mongoose.default.connection.on('disconnected', function () {
  log.info('Mongoose connection is disconnected');
});

_mongoose.default.connection.on('error', function (err) {
  log.error('Mongoose connection error: %o', err);

  _mongoose.default.disconnect();
}); // do something when app is closing


process.on('exit', function () {
  _mongoose.default.connection.close(function () {
    return log.info('Mongoose connection is disconnected due to exit');
  });
}); // catches ctrl+c event

process.on('SIGINT', function () {
  _mongoose.default.connection.close(function () {
    return log.info('Mongoose connection is disconnected due to SIGINT');
  });
}); // catches 'kill pid' (for example: nodemon restart)

process.on('SIGUSR1', function () {
  _mongoose.default.connection.close(function () {
    return log.info('Mongoose connection is disconnected due to SIGUSR1');
  });
});
process.on('SIGUSR2', function () {
  _mongoose.default.connection.close(function () {
    return log.info('Mongoose connection is disconnected due to SIGUSR2');
  });
}); // catches uncaught exceptions

process.on('unhandledRejection', function (reason, p) {
  log.error('%o Unhandled Rejection at Promise %o', reason, p); // info(reason, 'Unhandled Rejection at Promise', p);

  _mongoose.default.connection.close(function () {
    return log.info('Mongoose connection is disconnected due to unhandledRejection');
  });
});
process.on('uncaughtException', function (err) {
  log.error("'Uncaught Exception thrown %o", err);

  _mongoose.default.connection.close(function () {
    return log.info('Mongoose connection is disconnected due to uncaughtException');
  });
});