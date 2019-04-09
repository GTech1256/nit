import './event';

import mongoose from 'mongoose';

mongoose.set('debug', process.env.DEBUG);
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

function getUrlForMongooseConnection() {
  let prefixOfENV = process.env.NODE_ENV.toUpperCase();

  switch (prefixOfENV) {
    case 'DEVELOPMENT':
      prefixOfENV = 'DEV';
      break;
    case 'PRODUCTION':
      prefixOfENV = 'PROD';
      break;
    case 'TEST':
      prefixOfENV = 'TEST';
      break;
    default:
      prefixOfENV = 'DEV';
      break;
  }

  const { env } = process;

  const authString = process.env.NODE_ENV === 'production'
    ? `${env[`${prefixOfENV}_DB_USERNAME`]}:${env[`${prefixOfENV}_DB_PASSWORD`]}@`
    : '';


  const connectionUrl = `mongodb://${authString}${env[`${prefixOfENV}_DB_HOSTNAME`]}:${
    env[`${prefixOfENV}_DB_PORT`]
  }/${env[`${prefixOfENV}_DB_NAME`]}`;

  console.log(
    'url for connect:',
    connectionUrl,
  );
  return connectionUrl;
}

mongoose
  .connect(
    getUrlForMongooseConnection(),
    { useNewUrlParser: true },
  )
  .then(
    () => {
      console.log('Database connected');
    },
    () => {
      console.error('Connect to database broken');
    },
  );
