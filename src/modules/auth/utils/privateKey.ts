import { sign, SignOptions, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { environment } from '@/config/environment';
import { LocalWallet } from '@thirdweb-dev/wallets';
import { Mumbai } from '@thirdweb-dev/chains';
import { AptosAccount } from 'aptos'
import { encryptStringToJson, decryptJsonToString } from './encrypt';
import { createAccount } from '@/modules/aptos/utils/create-account';


export async function createEVMPrivateKey(password: string) {
  const wallet = new LocalWallet({
    chain: Mumbai,
  });

  // create a wallet
  await wallet.generate();

  //connect the wallet
  const walletAddress = await wallet.connect();

  //export the wallet
  const privateKey = await wallet.export({
    strategy: 'encryptedJson',
    password: password,
  });
  return { walletAddress, privateKey };
}

export async function createAptosPrivateKey(password: string) {
  const aptosAccount = new AptosAccount()
  const aptosAccountObj = aptosAccount.toPrivateKeyObject()
  console.log(aptosAccountObj)
  const aptosAddress = aptosAccountObj.address
  const aptosPublicKey = aptosAccountObj.publicKeyHex
  const aptosPrivateKey = encryptStringToJson(aptosAccountObj.privateKeyHex, password)
  try {
    await createAccount(aptosAddress)
  }
  catch (e) {
    console.error("Could not creatAccount on aptos", e)
  }
  return { aptosAddress, aptosPublicKey, aptosPrivateKey };

}

export async function reEncryptEVMPrivateKey(password: string, user: User) {
  const accounts: any = user.accounts
  if (accounts !== null) {
    const evmAccount: any = accounts['EVM']
    const privateKeyJSON: string = evmAccount.privateKey
    const config = {
      strategy: 'encryptedJson',
      password: user.password,
      encryptedJson: privateKeyJSON,
    };
    const localWallet = new LocalWallet({
      chain: Mumbai,
    });
    await localWallet.import(config);

    const privateKey = await localWallet.export({
      strategy: 'encryptedJson',
      password: password,
    });

    return privateKey;
  }
}

export async function reEncryptAptosPrivateKey(password: string, user: User) {
  const accounts: any = user.accounts
  if (accounts !== null) {
    const aptosAccount: any = accounts['APTOS']
    const privateKeyJSON: string = aptosAccount.privateKey
    const decryptedPrivateKey = decryptJsonToString(privateKeyJSON, user.password)
    const encryptedPrivateKey = encryptStringToJson(decryptedPrivateKey, password)
    return encryptedPrivateKey
  }
}
