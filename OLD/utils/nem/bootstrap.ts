import { default as log } from '../logger/logger';

import * as nemHelpers from './nemHelpers';

import {
  ServerConfig,
  BlockHttp,
  ChainHttp,
  TransactionInfo,
  QueryParams,
  HashData,
  Asset,
  AssetId,
  Transaction,
  AccountHttp,
  Address,
  NEMLibrary,
  NetworkTypes,
  Account,
  ConfirmedTransactionListener,
  TransactionTypes,
  TransferTransaction,
  TimeWindow,
  PlainMessage,
  TransactionHttp,
  MultisigTransaction,
} from 'nem-library';

import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

import { default as getTrustedNodes } from '../config/trustedNodes';

export interface NemConfig {
  // appAccount: Account, // TODO: can be set only after bootstrap
  networkType: NetworkTypes;
  privateSalt: string;
  appAddress: string;
  fee: {
    transfer: number;
    mosaicRental: number;
    space: number;
  };
}
export interface NodesHttpConfig {
  nodeAccountHttp?: AccountHttp;
  nodeChainHttp?: ChainHttp;
  nodeBlockHttp?: BlockHttp;
  nodeTransactionHttp?: TransactionHttp;
}

export interface NodeMetadata {
  nemNodeSendTimeStamp: number;
  nemNodeReceiveTimeStamp: number;
  nemNodeTimeStampsUdated: Date;
  isWorking: boolean;
}

function initializeHttp(nodes: ServerConfig[]): NodesHttpConfig {
  return {
    nodeAccountHttp: new AccountHttp(nodes),
    nodeChainHttp: new ChainHttp(nodes),
    nodeBlockHttp: new BlockHttp(nodes),
    nodeTransactionHttp: new TransactionHttp(nodes),
  };
}

export interface BootstrapConfig {
  nodesHttp: NodesHttpConfig;
  nodesMetadata: NodeMetadata;
}

function bootstrapPromise(nemConfig: NemConfig, configToChange: BootstrapConfig): Promise<any> {
  return new Promise(function(resolve, reject) {
    log.info(`bootstaping NEM network in
      ${nemConfig.networkType === NetworkTypes.TEST_NET ? 'TEST_NET' : 'MAIN_NET'} mode`);

    const trustedNodes = getTrustedNodes(nemConfig).trustedNodesList;

    configToChange.nodesHttp = initializeHttp(trustedNodes);

    // TODO: try in loop untill got timeStamps
    nemHelpers
      .getNemNodeTimeStamps(trustedNodes[0]) // TODO: support more than 1 node
      .then(function(data: any) {
        configToChange.nodesMetadata.nemNodeTimeStampsUdated = new Date();
        configToChange.nodesMetadata.nemNodeReceiveTimeStamp = data.data.receiveTimeStamp;
        configToChange.nodesMetadata.nemNodeSendTimeStamp = data.data.sendTimeStamp;
        log.info(`Updated nem node timestamps ${configToChange.nodesMetadata.nemNodeTimeStampsUdated.toISOString()}`);
        resolve(data);
      })
      .catch(function(err: any) {
        // TODO: unlock planet & remove contract
        log.info(`updateNemNodeTimeStamps: catch: ${err}`);
        reject(err);
      });
  });
}

// TODO: wait untill bootstraped
export default bootstrapPromise;
