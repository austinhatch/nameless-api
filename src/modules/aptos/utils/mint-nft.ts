import { aptos, getAptosAccount } from "./aptos-config";

export async function mintNFT( collection: string, description:string, name:string, uri:string){
  const aptosAccount = await getAptosAccount()
  const mintTokenTransaction = await aptos.mintTokenTransaction({
    creator: aptosAccount,
    collection: collection,
    description: description,
    name: name,
    uri: uri,
  });
  
  const committedTxn = await aptos.signAndSubmitTransaction({ signer: aptosAccount, transaction: mintTokenTransaction });
}

export function buildTokenURI(){

}

export async function transferNFT(token_data_id: string, to_address: any){
  const aptosAccount = await getAptosAccount()
  const transferTransaction = await aptos.transferDigitalAsset({
    sender: aptosAccount,
    digitalAssetAddress: token_data_id,
    recipient: to_address,
  });
  const committedTxn = await aptos.signAndSubmitTransaction({ signer: aptosAccount, transaction: transferTransaction });
  const pendingTxn = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
}