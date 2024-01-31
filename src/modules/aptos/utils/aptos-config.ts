import { environment } from '@/config/environment';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey, Account, AccountSequenceNumber  } from "@aptos-labs/ts-sdk";

let aptosConfig: AptosConfig;

if (environment.aptos_chain === 'TEST') {
  aptosConfig = new AptosConfig({ network: Network.TESTNET });
} else if (environment.aptos_chain === 'MAIN') {
  aptosConfig = new AptosConfig({ network: Network.MAINNET });
} else {
  throw new Error('Invalid environment');
}

export const aptos = new Aptos(aptosConfig);
const privateKey = new Ed25519PrivateKey(environment.aptos_private_key);
const aptosAccount = Account.fromPrivateKey({ privateKey });
const accountSequenceNumber = new AccountSequenceNumber(aptosConfig, aptosAccount, 1000, 1000, 1000);

export function getAptosAccount() {
  return aptosAccount;
}

export async function getSequenceNumber() {
  const nextSequenceNumber = await accountSequenceNumber.nextSequenceNumber();
  const nextSequenceNumberNumber = Number(nextSequenceNumber);
  console.log(Number(nextSequenceNumber));
  return nextSequenceNumberNumber;
}