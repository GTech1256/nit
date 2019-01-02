import './event';

import mongoose from 'mongoose';

mongoose.set('debug', process.env.DEBUG);
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

function getUrlForMongooseConnection() {
  const prefixOfENV = process.env.NODE_ENV.toUpperCase();
  const { env } = process;

  const authString =		process.env.NODE_ENV === 'production'
		  ? `${env[`${prefixOfENV}_DB_USERNAME`]}:${env[`${prefixOfENV}_DB_PASSWORD`]}@`
		  : '';

  console.log(
    'url for connect:',
    `mongodb://${Boolean(authString)}${env[`${prefixOfENV}_DB_HOSTNAME`]}:${
      env[`${prefixOfENV}_DB_PORT`]
    }/${env[`${prefixOfENV}_DB_NAME`]}`,
  );
  return `mongodb://${authString}${env[`${prefixOfENV}_DB_HOSTNAME`]}:${
    env[`${prefixOfENV}_DB_PORT`]
  }/${env[`${prefixOfENV}_DB_NAME`]}`;
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
