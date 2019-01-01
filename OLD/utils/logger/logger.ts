import * as winston from 'winston';
import transports from './transports';

const log = winston.createLogger({
  transports,
}) as winston.Logger;

// TODO: function notifyAdmin (by email)

export default log;
