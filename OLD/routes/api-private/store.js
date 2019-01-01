const config = require('../../config/appconfig').default;
const express = require('express');
const store = express.Router();
const Blowfish = require('egoroof-blowfish');
const Planet = require('../../utils/models/planet').default;
const SmartContract = require('../../utils/models/contract').default;
const transaction = require('../../utils/nem/transaction');

const wallet = require('../../utils/nem/wallet').default;

const log = require('../../utils/logger/logger').default;
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const uuid = require('uuid/v4');

// initialize bf

const bf = new Blowfish(config.nem.privateSalt, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);

// TODO: move to utils
/*
var utcDate1 = new Date('2018-11-18T00:00:00+00:00');
var utcDate2 = new Date('9018-11-18T00:00:00+00:00');
console.log(utcDate1.toUTCString());
console.log(utcDate2.toUTCString());
console.log(diffDates(utcDate2, utcDate1))
// Sun, 18 Nov 2018 00:00:00 GMT
// Wed, 18 Nov 9018 00:00:00 GMT
// 220898620800
*/
function diffDates( dateBigger, dateSmaller, time_frame_ms ) {
  //var time_frame_ms = 1000*60*60*24; // 1 day

  // Convert both dates to milliseconds
  var dateBigger_ms = dateBigger.getTime();
  var dateSmaller_ms = dateSmaller.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = dateBigger_ms - dateSmaller_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/time_frame_ms); 
}

// TODO: move to utils
/*
console.log(toCustomTimestamp( new Date('9018-11-18T00:00:00+00:00') ))
// 220898620800
*/
function toCustomTimestamp(date) {
	var time_frame_ms = 1000; // timestamp in seconds elapsed from epoch
  var customEpoch = new Date('2018-11-18T00:00:00+00:00');
  return diffDates(date, customEpoch, time_frame_ms); // date > epoch
}

// used to generate unique GUID
function generateSeedForGUID() {
  // TODO: check collision probability & move to utils
  //                                               
  // 220898620800ba038e-48da-487b-96e8-8d3b99b6d18a
  // ^ timestamp ^ guid                            ^ reserved space untill 0.2 xem per transaction
  //                                               fffffffffffffffff
  const randomGUIDSeed = toCustomTimestamp(new Date()) + uuid();
  return randomGUIDSeed;
  // TODO: to hex later
}


function randomSubstredWallet() {
  //const password = new Password(generateSeedForGUID() + "TODO_SALT_HERE");
  //const simpleWallet = SimpleWallet.create(generateSeedForGUID(), password);
  //console.log("simpleWallet.address", simpleWallet.address.plain().substr(1)); // BXNMARBKKXTA5TTM7RME63LISJWM5NUYYJYARN5

  // 2^160 possible addresses = 1461501637330902918203684832716283019655932542976
  //
  // BVB6WYOJL2XCH4PVUAMMPTTLOLERQ7Y72GJFI5Rssssssssssssssssssssssss
  //                                        ^ reserved space untill 0.2 xem per transaction
  // Note: we removed first symbol = network type
  //const randomAddr = simpleWallet.address.plain().substr(1);
  const randomAddr = wallet(config.nem.privateSalt, generateSeedForGUID() + "TODO_SALT_HERE").address.substr(1);

  // subtr-ed to fit 0.1 XEM
  // TODO: calc collision probability
  // BVB6WYOJL2XCH4PVUAMMPTTLOLERQ7Y
  //                                ^ next symbol = 0.15 XEM
  const substredAddr = randomAddr.substr(0,31);
  
  return substredAddr;
}

// TODO: move to utils
function substredWalletToFull(shortAddress) {
  const salt = "72GJFI5R"; // TODO: to config
  return shortAddress + salt; // add missing chars to form valid nem wallet address
}

// used to generate unique GUID for this operation
function generateLockGUID() {
  // use random wallet address as GUID. We will send 0xem to that address
  const randomGUID = randomSubstredWallet();
  return randomGUID;
}

// TODO: notify admin if lock fails
async function lockPlanet(planetId, lockGUID) {

  // find unlocked & currently selling planet
  return Planet.findOneAndUpdate({
    id: planetId,
    'status.lockGUID': 'none',
    'status.forSale': true
  }, {
    $set: {
      'status.lockGUID': lockGUID
    }
  }, {
    new: true
  });
}

// TODO: notify admin if unlock fails
// NOTE: don`t forget to reset lock in case of error (only if money not sent)
async function unlockPlanet(planetId, lockGUID) {

  // find locked & currently selling planet
  // lock GUID must match
  return Planet.findOneAndUpdate({
    id: planetId,
    'status.lockGUID': lockGUID,
    'status.forSale': true
  }, {
    $set: {
      'status.lockGUID': 'none',
    }
  }, {
    new: true
  });

  // TODO: delete SmartContract by lockGUID where called unlockPlanet 
}

function calcBuyTransferAmount(planet, buyer) {
  /*let transferAmount = config.nem.fee.space +
    config.nem.fee.transfer +
    config.nem.fee.mosaicRental +
    planet.status.sale.cost;

  if (planet.owner === 'none') {
    transferAmount -= config.nem.fee.transfer;

    if (buyer.ref1) {
      //transferMessage += `ref1:${buyer.ref1};`
    }

    if (buyer.ref2) {
      //transferMessage += `ref2:${buyer.ref2};`
    }
  }*/

  // TODO: update fees to fixed (cost + config.nem.fee.transferMinimalMessage + config.nem.fee.transferEmptyMessage + our comission)
  // UPD: only cost, because all fees included at sell offer creation. ENSURE
  return planet.status.sale.cost;
}

function encodeBuyTransactionMessage(buyer, planetId, thisOperationGUID) {
  /*let transferMessage = `!collection:planets;id:${planetId};`; // TODO: add namespace to message

  if (canBeBought.owner === 'none') {
    transferAmount -= config.nem.fee.transfer;

    if (buyer.ref1) {
      transferMessage += `ref1:${buyer.ref1};`
    }

    if (buyer.ref2) {
      transferMessage += `ref2:${buyer.ref2};`
    }

  }*/

  // TODO: to HEX?
  let transferMessage = `${thisOperationGUID}`;

  return transferMessage;
}

async function storeSmartContractWithGUIDInDB(buyer, buyingPlanet, thisOperationGUID) {
  // TODO
  /*SmartContract.findOneAndUpdate({
    id: thisOperationGUID
    }, {
      $set: {
        'status.processed': 'none'
      }
    },
    log // log ??????
  );*/
  // assume uniquness checked earlier
  return new SmartContract({
    guid: thisOperationGUID,
    title: "CHANGE_OWNER",
    namespace: "nemspace.io",
    body: {
      program: "CHANGE_OWNER", // TODO: use wasm
      inputs: `${buyer.wallet.address}` // TODO: use wasm
    },
    sender: buyer.wallet.address,
    target: {
      type: 0, // TODO: enum
      value: buyingPlanet.id
    },
    status: 0, // TODO: use ContractState.Unset
  });
}

// don`t wait to finish
// TODO: move to client? how to wait?
function broadcastBuyTransactionAsync(buyingPlanetId, buyerWallet, thisOperationGUID, transferAmount, transferMessage) {
  bf.setIv(buyerWallet.iv);
  const privateKey = bf.decode(new Uint8Array(buyerWallet.privateKey.buffer), Blowfish.TYPE.STRING);

  transaction.createXEMTransferTransaction(config.bootstrapConfig, config.nem, privateKey, config.nem.appAddress, transferAmount, transferMessage, null);
  /*transaction.signAndAnnounceTransaction(config.bootstrapConfig, , privateKey, tx, () => {
    //apiCodes[0](res, 'transaction initialized');
    console.log("transaction initialized!!!!!!!!!!")
  }, err => {
    console.log("transaction failed with err!!!!!!!!!!", err)

    unlockPlanet(buyingPlanetId, thisOperationGUID);
    // TODO: delete SmartContract by lockGUID where called unlockPlanet 

    if (err.message === 'FAILURE_INSUFFICIENT_BALANCE') {
      //apiCodes[12](res);
    } 
    if (err.message === 'FAILURE_TIMESTAMP_TOO_FAR_IN_FUTURE') {
      //apiCodes[12](res);
    } 
    else {
      next(err);
    }

  });*/
}

async function validatePlanetCanBeBought(planet, customerAddress, customerLastOwnerUpdate, res, thisOperationGUID) {

  if (!planet) {
    return apiCodes.PLANET_NOT_FOUND(res);
  }

  if (planet.owner === customerAddress) {
    return apiCodes.CANT_SELF_BUY(res);
  }

  if (!planet.status.forSale) {
    return apiCodes.NOT_IN_STOCK(res);
  }

  console.log("lockGUID is", planet.status.lockGUID)
  if (planet.status.lockGUID !== 'none') {
    return apiCodes.ITEM_IS_LOCKED(res);
  }

  // check if item is same as expected during buy
  // if client side product != server side product => reject
  if (+customerLastOwnerUpdate !== planet.status.lastOwnerUpdate) {
    return apiCodes.ITEM_CHANGED_DURING_CLAIM(res);  
  }

  return "ALL_GOOD";
}

// post request is being used to buy planet with corresponding id
// req.body must contain 'lou' param with value derived from planetObject.status.lastOwnerUpdate

store.post('/planets/id/:id',
(req, res, next) => {
  req.objectForValidate = {
    id: req.params.id,
    lou: req.body.lou
  }
  next()
},
JoiMiddleware('private_store_planets_id', 'objectForValidate'),
async (req, res, next) => {
  try {
    const thisOperationGUID = generateLockGUID();
    console.log("thisOperationGUID", thisOperationGUID); // ATWFSSFF4IP73VUORKOZTECJJ3NDNOL

    // guid must be unique for every buy operation
    const isConractGUIDCollided = await SmartContract.findOne({
      'guid': thisOperationGUID
    }).exec();
    if (isConractGUIDCollided) {
      // TODO: notify admin about weak guid randomness
      return apiCodes.CONTRACT_GUID_COLLISION(res);
    }

    const buyer = req.user;
    const buyerLou = req.resultOfJoiValidate.value.lou;
    const buyingPlanetId = req.resultOfJoiValidate.value.id;

    //console.log("req.user is ", buyer)

    const buyingPlanet = await Planet.findOne({
      'id': buyingPlanetId
    }).exec(); // might be optimized but statuses will be lost

    let apiCodeForCanBeBought = await validatePlanetCanBeBought(buyingPlanet, buyer.wallet.address, buyerLou, res, thisOperationGUID);
    console.log("apiCodeForCanBeBought is", apiCodeForCanBeBought)
    if (apiCodeForCanBeBought !== "ALL_GOOD") {
      // we can unlock planet only if money not sent
      unlockPlanet(buyingPlanet.id, thisOperationGUID);
      // TODO: delete SmartContract by lockGUID where called unlockPlanet 
      return apiCodeForCanBeBought;
    }

    const foundUnlockedPlanet = await lockPlanet(buyingPlanet.id, thisOperationGUID);
    console.log("foundUnlockedPlanet", foundUnlockedPlanet)
    if (!foundUnlockedPlanet) {
      // lock failed
      return apiCodes.NOT_IN_STOCK(res);
    }

    console.log("storeSmartContractWithGUIDInDB...")

    // TODO: check
    const storedContract = await storeSmartContractWithGUIDInDB(buyer, buyingPlanet, thisOperationGUID);
    await storedContract.save();
    if (!storedContract) {
      // we can unlock planet only if money not sent
      unlockPlanet(buyingPlanet.id, thisOperationGUID);
      // TODO: delete SmartContract by lockGUID where called unlockPlanet 
      return apiCodes.CANT_STORE_CONTRACT(res);
    }

    console.log("encodeBuyTransactionMessage...")
    const transferMessage = encodeBuyTransactionMessage(buyer, buyingPlanetId, thisOperationGUID);

    console.log("calcBuyTransferAmount...")
    const transferAmount = calcBuyTransferAmount(buyingPlanet, buyer);

    /*console.log("broadcastBuyTransaction...")
    let broadcastResult = await broadcastBuyTransaction(buyingPlanetId, buyer.wallet, thisOperationGUID, transferAmount, transferMessage);
    console.log("broadcastResult", broadcastResult);
    if (!broadcastResult) {
      // we can unlock planet only if money not sent
      unlockPlanet(buyingPlanet.id, thisOperationGUID);
      // TODO: delete SmartContract by lockGUID where called unlockPlanet 
      return apiCodes.CANT_BROADCAST_TO_BLOCKCHAIN(res);
    }*/

    // TODO: a) use wait with timeout OR b) notify user by providing transactions table & use queue
    broadcastBuyTransactionAsync(buyingPlanetId, buyer.wallet, thisOperationGUID, transferAmount, transferMessage);

    // TODO: 
    // 1. recieve broadcasted transaction
    // 2. check & save on nem by sending 0 xem to random wallet === GUID
    // 3. save on db & unlock & update lou
    // we spent 0.1 xem to transfer profits to 1 main wallet. (didn`t count later profits movemets)
    // we spent 0.05 xem to store data GUID (send 0 xem without message)
    // TOTAL = 0.18$-0.4$ RUB per operation

    return apiCodes.ALL_GOOD(res);

    // TODO: add timeouts to all remove requests

  } catch (err) {
    // TODO: unlock here?
    console.log("err", err);
    next(err);
  }
});

module.exports = store;
