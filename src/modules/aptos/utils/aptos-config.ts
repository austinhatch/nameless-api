import { environment } from '@/config/environment';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey  } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET }); // default to devnet
export const aptos= new Aptos(aptosConfig);

export function getAptosAccount(){
    const privateKey = new Ed25519PrivateKey(environment.aptos_private_key);
    const aptosAccount = aptos.deriveAccountFromPrivateKey({ privateKey })
    return aptosAccount
}