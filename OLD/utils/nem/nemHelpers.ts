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

import bootstrap from './bootstrap';
import { NodesHttpConfig } from '../nem';

// TODO: find new node if failed
// TODO: support more than 1 node
// tslint:disable-next-line:max-line-length
// TODO https://github.com/tadajamdev/nem-services/blob/90484495a5b49277c2dcab66032d6ac1312aa6e0/src/networkRequests.ts#L476
function getNemNodeTimeStamps(node: ServerConfig) {
  return axios.get(`${node.protocol}://${node.domain}:${node.port}/time-sync/network-time`, {
    timeout: 15000, // TODO
  });
}

// from latest to last, upside down
function getTransactionsInRangePaginatedById(
  nodesHttp: NodesHttpConfig,
  accountWallet: Account,
  latestId: number,
  lastId: number
): Promise<Transaction[]> {
  const accountHttpOptions: QueryParams = {
    pageSize: 100, // The xem of transactions returned. Between 5 and 100, otherwise 10
    id: latestId, // note: pagination by id don`t work between nodes
  };

  return new Promise((resolve, reject) => {
    const pagedTransactions = nodesHttp.nodeAccountHttp!.incomingTransactionsPaginated(
      accountWallet.address,
      accountHttpOptions
    );
    // tslint:disable-next-line:prefer-const
    let collectedTransactions: Transaction[] = [];

    pagedTransactions.subscribe(
      (transactions) => {
        for (const tx of transactions) {
          if (tx.getTransactionInfo().id === lastId) {
            resolve(collectedTransactions);
            break;
          }
          // console.log(tx.getTransactionInfo().hash);
          // sort from old to new (for easy processing) by adding to the beginning
          collectedTransactions.unshift(tx);
        }

        pagedTransactions.nextPage();
      },
      (err) => {
        reject(err);
      },
      () => {
        resolve(collectedTransactions);
      }
    );
  });
}

const nemAssetId = new AssetId('nem', 'xem');

export { nemAssetId, getNemNodeTimeStamps, getTransactionsInRangePaginatedById };
