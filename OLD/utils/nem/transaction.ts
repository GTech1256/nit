import {
  XEM,
  SignedTransaction,
  NetworkTypes,
  NemAnnounceResult,
  Account,
  Address,
  TransactionHttp,
  Transaction,
  TransferTransaction,
  TimeWindow,
  PlainMessage,
  EmptyMessage,
} from 'nem-library';

import { default as log } from '../logger/logger';

import { Observable } from 'rxjs';

import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

import { ChronoUnit, LocalDateTime, ZoneOffset, nativeJs } from 'js-joda';
import { NodesHttpConfig, BootstrapConfig, NemConfig } from './bootstrap';

function signAndAnnounceTransaction(
  bootstrapConfig: BootstrapConfig,
  signerPrivateKey: string,
  transaction: Transaction,
  cb: any,
  errCb: any
) {
  // NEM network type supposed to be set on server initialization

  const account = Account.createWithPrivateKey(signerPrivateKey);

  const transactionHttp = bootstrapConfig.nodesHttp.nodeTransactionHttp;
  const signedTransaction = account.signTransaction(transaction);

  const subscriber = transactionHttp!.announceTransaction(signedTransaction).subscribe(
    function(announceResult: any) {
      if (cb) {
        cb(announceResult);
      }
      subscriber.unsubscribe();
    },
    function(err: any) {
      if (errCb) {
        errCb(err);
      }
      subscriber.unsubscribe();
    }
  );
}

function signAndAnnounceTransactionPromise(
  bootstrapConfig: BootstrapConfig,
  signerPrivateKey: string,
  transaction: Transaction
): Promise<NemAnnounceResult> {
  // NEM network type supposed to be set on server initialization

  const account = Account.createWithPrivateKey(signerPrivateKey);
  const transactionHttp = bootstrapConfig.nodesHttp.nodeTransactionHttp;
  const signedTransaction = account.signTransaction(transaction);

  return new Promise<NemAnnounceResult>((resolve, reject) => {
    const subscriber = transactionHttp!.announceTransaction(signedTransaction).subscribe(
      function(announceResult: any) {
        subscriber.unsubscribe(); // TODO: need unsubscribe?
        resolve(announceResult);
      },
      function(err: any) {
        subscriber.unsubscribe(); // TODO: need unsubscribe?
        reject(err);
      }
    );
  });
}

function toNemEpochDateTime(secs: any) {
  const t: Date = new Date(Date.UTC(2015, 2, 29, 0, 6, 25, 0));
  t.setSeconds(secs);
  return t;
}

/**
 * Fix 'FAILURE_TIMESTAMP_TOO_FAR_IN_FUTURE'
 *
 * @param {object} transaction - A prepared transaction to fix
 * @param {number} chainTime - Time returned by the NIS node
 * @param {number} network - A network
 */
// TODO: microservice that periodically updates chainTime
function fixTimestamp(receiveTimeStamp: any, isTestnet: boolean) {
  const d = new Date();
  const timeStamp = Math.floor(receiveTimeStamp) + Math.floor(d.getSeconds() / 10);

  log.info('fixTimestamp timeStamp', timeStamp);
  const due = isTestnet ? 60 : 24 * 60;
  const deadline = timeStamp + due * 60;

  return {
    timeStamp: LocalDateTime.from(nativeJs(toNemEpochDateTime(timeStamp))),
    deadline: LocalDateTime.from(nativeJs(toNemEpochDateTime(deadline))),
  };
}

function getAdjustedNodeTimeStamp(bootstrapConfig: BootstrapConfig) {
  return (new Date().getTime() - bootstrapConfig.nodesMetadata.nemNodeTimeStampsUdated.getTime()) / 1000;
}

// TODO: find new node if failed
function createXEMTransferTransaction(
  bootstrapConfig: BootstrapConfig,
  nemConfig: NemConfig,
  senderPrivateKey: any,
  recieverAddress: any,
  amount: any,
  message: any,
  time: any
) {
  let precessedMessage = message;
  if (message) {
    precessedMessage = PlainMessage.create(message);
  } else {
    precessedMessage = EmptyMessage;
  }

  const senderWallet = Account.createWithPrivateKey(senderPrivateKey);
  log.info('senderWallet =', senderWallet);

  const transactionHttp = bootstrapConfig.nodesHttp.nodeTransactionHttp;

  log.info('config.nemNodeReceiveTimeStamp', bootstrapConfig.nodesMetadata.nemNodeReceiveTimeStamp);
  let receiveTimeStamp = bootstrapConfig.nodesMetadata.nemNodeReceiveTimeStamp / 1000;
  const secElapsedFromLastUpdate = getAdjustedNodeTimeStamp(bootstrapConfig);
  receiveTimeStamp = receiveTimeStamp + secElapsedFromLastUpdate;

  log.info('approx chainTime', receiveTimeStamp);
  const timestamps = fixTimestamp(receiveTimeStamp, nemConfig.networkType === NetworkTypes.TEST_NET);

  const timeStamp = timestamps.timeStamp;
  log.info('timeStamp:LocalDateTime', timeStamp);

  const deadline = timestamps.deadline;
  log.info('deadline:LocalDateTime', deadline);

  const transferTransaction: Transaction = TransferTransaction.create(
    new TimeWindow(timeStamp, deadline),
    new Address(recieverAddress),
    new XEM(amount),
    precessedMessage
  );

  log.info('Broadcasting transaction...');

  const signedTransaction: SignedTransaction = senderWallet.signTransaction(transferTransaction);

  log.info('Signed transaction...');

  const subscriber = transactionHttp!.announceTransaction(signedTransaction).subscribe(
    function(announceResult: any) {
      log.info('Announced transaction');
      subscriber.unsubscribe();
    },
    function(err: any) {
      log.error('ERROR: transaction not announced');
      log.error(err);

      // TODO: send human-readable reason to user
      /*if (err.message === 'FAILURE_INSUFFICIENT_BALANCE') {
      //log.info('FAILURE_INSUFFICIENT_BALANCE');
    } else {
      //next(err);
    }*/

      // TODO: unlock planet & remove contract
      subscriber.unsubscribe();
    }
  );
}

export { signAndAnnounceTransaction, createXEMTransferTransaction, signAndAnnounceTransactionPromise };
