import { ConnectionOptions } from 'mongoose';
import { default as log } from '../logger/logger';

interface DbSettings {
  dbType: string;
  dbHostname: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPass: string;
}

interface DbConnection {
  uri: string;
  options: ConnectionOptions;
}

/**
 * get url for DB connection by process.env.NODE_ENV
 * @return {string} url for connection e.g. mongodb://localhost:27017/nemapp
 */
function getDatabaseUrl(settings: DbSettings) {
  if (`${settings.dbType}` === `mongodb+srv`) {
      // https://mongobooster.useresponse.com/topic/ports-not-accepted
    log.info('using default db port!');
    return `${settings.dbType}://${settings.dbHostname}/${settings.dbName}`;
  }

  log.info(`db port: ${settings.dbPort}`);
  return `${settings.dbType}://${settings.dbHostname}:${settings.dbPort}/${settings.dbName}`;
}

/**
 * get object of config DB for config
 * @return {object} object of config DB for config
 */
function getDBConnection(settings: DbSettings) {
  return {
    uri: getDatabaseUrl(settings),
    options: {
      uri_decode_auth: true, // https://stackoverflow.com/a/23344660
      // useMongoClient: true,
      // useNewUrlParser: true, // deprecated string parser https://mongoosejs.com/docs/connections.html
      name: settings.dbName,
      user: settings.dbUser,
      pass: settings.dbPass,
      autoIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 5000, // in milliseconds
      connectTimeoutMS: 15000,
      poolSize: 10,
      server: {
        auto_reconnect:true
      }
    } as ConnectionOptions
  } as DbConnection;
}

export { getDBConnection, DbSettings, DbConnection };
