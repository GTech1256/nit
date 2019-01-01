import mongoose from 'mongoose';

const log = {
  info: () => console.log,
  error: () => console.log,
};

/* events with connection */
mongoose.connection.on('connecting', () => log.info('connecting to MongoDB...'));
mongoose.connection.on('reconnected', () => log.info('MongoDB reconnected!'));
mongoose.connection.on('connected', () => log.info('Mongoose is connected'));

mongoose.connection.once('open', () => log.info('MongoDB connection opened!'));

mongoose.connection.on('disconnected', () => {
  log.info('Mongoose connection is disconnected');
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
process.on('unhandledRejection', (reason, p) => {
  log.error('%o Unhandled Rejection at Promise %o', reason, p);
  // info(reason, 'Unhandled Rejection at Promise', p);
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to unhandledRejection'),);
});

process.on('uncaughtException', (err) => {
  log.error("'Uncaught Exception thrown %o", err);
  mongoose.connection.close(() => log.info('Mongoose connection is disconnected due to uncaughtException'),);
});
