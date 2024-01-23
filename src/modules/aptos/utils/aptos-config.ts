import { environment } from '@/config/environment';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey, Account, AccountSequenceNumber  } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET }); // default to devnet
export const aptos= new Aptos(aptosConfig);
const privateKey = new Ed25519PrivateKey(environment.aptos_private_key);
const aptosAccount = Account.fromPrivateKey({ privateKey });
const accountSequenceNumber  = new AccountSequenceNumber(aptosConfig, aptosAccount, 100, 100, 100)



export function getAptosAccount(){
    return aptosAccount
}


export async function getSequenceNumber() {
    const nextSequenceNumber = await accountSequenceNumber.nextSequenceNumber()
    const nextSequenceNumberNumber = Number(nextSequenceNumber)
     console.log(Number(nextSequenceNumber))
    return nextSequenceNumberNumber

}