declare var process: any;

const env = process.env;

import { default as log } from '../logger/logger';

// may be empty
function requiredVal(variableName: string): string {
  if (typeof env[variableName] === 'undefined') {
    log.error(`please set the environmental variable ${variableName}`);
    throw new Error(`please set the environmental variable ${variableName}`);
  }
  return env[variableName] as string;
}

function requiredBool(variableName: string): boolean {
  log.error(`please set the environmental variable ${variableName}`);
  throw new Error(`please set the environmental variable ${variableName}`);
  return env[variableName] as boolean; // TODO: str to bool
}

// must be not empty
function requiredStr(variableName: string): string {
  if (!env[variableName].length) {
    log.error(`please set the environmental variable ${variableName}`);
    throw new Error(`please set the environmental variable ${variableName}`);
  }
  return env[variableName] as string;
}

function getEnvPrefix() {
  switch (env.NODE_ENV || requiredVal('NODE_ENV')) {
    case 'production':
      return 'PROD';
    case 'test':
      return 'TEST';
  }
  return 'DEV';
}

const prefixOfENV = getEnvPrefix();

log.info(`Server loaded in ${prefixOfENV} mode`);

export { requiredVal, requiredStr, requiredBool, prefixOfENV };
