import { sign, SignOptions, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { environment } from '@/config/environment';
import { LocalWallet } from '@thirdweb-dev/wallets';
import { Mumbai } from '@thirdweb-dev/chains';

export async function createPrivateKey(password: string) {
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

export async function reEncryptPrivateKey(password: string, user: User) {
  const config = {
    strategy: 'encryptedJson',
    password: user.password,
    encryptedJson: user.privateKey,
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
