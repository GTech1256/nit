"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nem_library_1 = require("nem-library");
const mongoutils_1 = require("../utils/mongo/mongoutils");
const database_1 = require("../utils/mongo/database");
const confHelper_1 = require("../utils/config/confHelper");
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
        return confHelper_1.requiredVal('PORT');
    },
    get appIP() {
        return confHelper_1.requiredVal('APP_IP');
    },
    get appProtocol() {
        return confHelper_1.requiredVal('APP_PROTOCOL');
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
        return env.CHECK_CORS === "1" || false;
    },
    get bucketName() {
        return confHelper_1.requiredVal(`${confHelper_1.prefixOfENV}_BUCKET_NAME`);
    },
    get mailgun() {
        return {
            apiKey: confHelper_1.requiredStr('MAILGUN_API_KEY'),
            domain: confHelper_1.requiredStr('MAILGUN_DOMAIN')
        };
    },
    allowedOrigins: confHelper_1.requiredVal('ALLOWED_CORS'),
    dbConnection: mongoutils_1.getDBConnection(database_1.dbSettings),
    referals: {
        level: {
            1: 0.1,
            2: 0.02,
        }
    },
    mail: {
        user: confHelper_1.requiredVal('MAIL_USERNAME')
    },
    get secretOrKey() {
        return confHelper_1.requiredVal('SECRET_OR_KEY');
    },
    authentication: {
        exp: '15min',
    },
    nem: {
        networkType: env.NEM_NETWORK_TYPE === 'TEST_NET' ? nem_library_1.NetworkTypes.TEST_NET : nem_library_1.NetworkTypes.MAIN_NET,
        privateSalt: confHelper_1.requiredVal('NEM_APP_SALT'),
        appAddress: confHelper_1.requiredVal('NEM_APP_ADDRESS'),
        fee: {
            transfer: +confHelper_1.requiredVal('NEM_TRANSFER_FEE'),
            mosaicRental: +confHelper_1.requiredVal('NEM_MOSAIC_RENTAL'),
            space: +confHelper_1.requiredVal('NEM_SPACE_FEE')
        }
    },
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
        accessKeyId: confHelper_1.requiredVal('IAM_USER_KEY'),
        secretAccessKey: confHelper_1.requiredVal('IAM_USER_SECRET'),
        region: 'us-east-2'
    },
    bootstrapConfig: {
        nodesHttp: {},
        nodesMetadata: {
            nemNodeSendTimeStamp: 0,
            nemNodeReceiveTimeStamp: 0,
            nemNodeTimeStampsUdated: new Date(-1),
            isWorking: false,
        }
    },
    trustedNodes: {},
};
exports.default = config;
//# sourceMappingURL=appconfig.js.map