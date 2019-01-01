import { SimpleWallet, Password, AccountHttp, Account, Address } from 'nem-library';
import * as rndString from 'randomstring';
import * as Blowfish from 'egoroof-blowfish';
import bson from 'bson';

function create(privateSalt: string, pwd?: string) {
  let password: Password;
  let newWallet: SimpleWallet;
  let privateKey;

  password = new Password(pwd ? pwd : rndString.generate());
  // TODO: check wallet unique
  const walletName = 'wallet';
  // TODO: walletName to config
  newWallet = SimpleWallet.create(walletName, password);
  privateKey = newWallet.unlockPrivateKey(password);

  // encrypt private key

  let iv;
  let bf;
  let encodedPrivateKey;

  iv = rndString.generate(8);
  bf = new Blowfish(privateSalt, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
  bf.setIv(iv);
  encodedPrivateKey = bf.encode(privateKey);

  return {
    iv,
    privateKey: Buffer.from(encodedPrivateKey),
    address: newWallet.address.plain(),
    approved: false,
  };
}

export default create;
