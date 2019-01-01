declare var process: any;

import {
  ServerConfig, BlockHttp, ChainHttp, TransactionInfo, QueryParams, HashData, Asset, AssetId, Transaction,
  AccountHttp, Address, NEMLibrary, NetworkTypes, Account, ConfirmedTransactionListener, TransactionTypes,
  TransferTransaction, TimeWindow, PlainMessage, TransactionHttp, MultisigTransaction
} from 'nem-library';

import {
  getDBConnection, DbSettings
} from '../utils/mongo/mongoutils';

import {
  dbSettings
} from '../utils/mongo/database';

import { NemConfig, BootstrapConfig, NodeMetadata, NodesHttpConfig } from '../utils/nem/bootstrap';

import { requiredVal, requiredStr, prefixOfENV } from '../utils/config/confHelper';

const env = process.env;

const config = {
  NODE_ENV: {
    dev: 'development',
    prod: 'production',
    test: 'test'
  },
  get isDevEnv() {
    return env.NODE_ENV !== this.NODE_ENV.prod;
  },
  get isProduction() {
    return env.NODE_ENV === this.NODE_ENV.prod;
  },
  get appPort() {
    return requiredVal('PORT');
  },
  get appIP() {
    return requiredVal('APP_IP');
  },
  get appProtocol() {
    return requiredVal('APP_PROTOCOL');
  },
  get appAdress() {
    if (this.isDevEnv) {
      return `${this.appIP}:${this.appPort}`;
    }
    return `${this.appIP}`;
  },
  get appFullAdress() {
    if (this.isDevEnv) {
      return `${this.appProtocol}://${this.appIP}:${this.appPort}`;
    }
    return `${this.appProtocol}://${this.appIP}`;
  },
  get checkOrigins() {
    if (this.isDevEnv) {
      return false;
    }
    // @note: be cautious (string to boolean) https://stackoverflow.com/a/264037
    return env.CHECK_CORS === "1" || false;
  },
  get bucketName() {
    return requiredVal(`${prefixOfENV}_BUCKET_NAME`);
  },
  get mailgun() {
    return {
      apiKey: requiredStr('MAILGUN_API_KEY'),
      domain: requiredStr('MAILGUN_DOMAIN')
    }
  },
  allowedOrigins: requiredVal('ALLOWED_CORS'),
  dbConnection: getDBConnection(dbSettings),
  referals: {
    level: {
      1: 0.1,
      2: 0.02,
    }
  },
  mail: {
    user: requiredVal('MAIL_USERNAME')
  },
  get secretOrKey() {
    return requiredVal('SECRET_OR_KEY');
  },
  authentication: {
    exp: '15min',
    // Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
    // If you use a string be sure you provide the time units (days, hours, etc),
    // otherwise milliseconds unit is used by default ("120" is equal to "120ms").
    // touchAfter: 10 * 60 // 30 * 60 ??
  },
  // TODO: use interface NemConfig
  nem: {
    networkType: env.NEM_NETWORK_TYPE === 'TEST_NET' ? NetworkTypes.TEST_NET : NetworkTypes.MAIN_NET,
    privateSalt: requiredVal('NEM_APP_SALT'),
    appAddress: requiredVal('NEM_APP_ADDRESS'),
    fee: {
      transfer: +requiredVal('NEM_TRANSFER_FEE'),
      mosaicRental: +requiredVal('NEM_MOSAIC_RENTAL'),
      space: +requiredVal('NEM_SPACE_FEE')
    }
  } as NemConfig,
  sale: {
    descMaxLength: 300
  },
  rating: {
    maxLength: 100
  },
  store: {
    pageSize: 10,
    maxPopulation: 1e10
  },
  refCookie: {
    exp: 30 * 24 * 60 * 60 * 1000
  },
  AWS: {
    accessKeyId: requiredVal('IAM_USER_KEY'),
    secretAccessKey: requiredVal('IAM_USER_SECRET'),
    region: 'us-east-2' // TODO
  },
  bootstrapConfig: {
    nodesHttp: {} as NodesHttpConfig, // bootstapped from bootstrap.ts,
    nodesMetadata: {
      nemNodeSendTimeStamp: 0, // bootstapped from bootstrap.ts,
      nemNodeReceiveTimeStamp: 0, // bootstapped from bootstrap.ts,
      nemNodeTimeStampsUdated: new Date(-1),
      isWorking: false,
    } as NodeMetadata
  } as BootstrapConfig,
  trustedNodes: {} as ServerConfig[], // TODO: separate
};

/*import getTrustedNodes from '../../utils/config/trustedNodes';

const trustedNodes = getTrustedNodes(config.nem).trustedNodesList;

config.trustedNodes = trustedNodes;*/

export default config;
