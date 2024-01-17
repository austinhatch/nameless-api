import { aptos, getAptosAccount } from "./aptos-config";
import { Account, AccountAddress } from "@aptos-labs/ts-sdk";
const encoder = new TextEncoder();

export async function createToken( address: string, collection: string, description:string, name:string, uri:string){
  const aptosAccount = await getAptosAccount()
  const recipient = AccountAddress.fromString(address)
  console.log(recipient)
  const mintTokenTransaction = await aptos.mintSoulBoundTransaction({
    account: aptosAccount,
    collection: collection,
    description: description,
    name: name,
    uri: uri,
    recipient: recipient,
  });
  
  const committedTxn = await aptos.signAndSubmitTransaction({ signer: aptosAccount, transaction: mintTokenTransaction });
  return committedTxn
}