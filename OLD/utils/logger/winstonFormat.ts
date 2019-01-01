import * as os from 'os';
import * as winston from 'winston';
import * as moment from 'moment';

const networkInterfaces = os.networkInterfaces();

let serverMacAddr = 'NOT_SET_MACADDR';
try {
  serverMacAddr = networkInterfaces.Ethernet[0].mac;
} catch (e) {
  serverMacAddr = 'CANT_DETECT_MACADDR'; // TODO: always CANT_DETECT_MACADDR in prod
}

export const consolePrint = winston.format.printf(function(info) {
  info.macAddress = serverMacAddr;
  return `${info.level}: ${JSON.stringify(info)} (${moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')})`;
});

export const filePrint = winston.format.printf(function(info) {
  info.macAddress = serverMacAddr;
  return JSON.stringify(info);
});

const fileFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.colorize(),
  filePrint
);

const consoleFormat = winston.format.combine(
  // winston.format.label({ label: colors.red('APP') }), // TODO
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.colorize(),
  consolePrint
);

export { fileFormat, consoleFormat };
