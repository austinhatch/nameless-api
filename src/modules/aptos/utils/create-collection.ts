import { aptos, getAptosAccount } from "./aptos-config";

export async function createCollection( collectionName: string, collectionDescription: string, collectionURI: string ){
    const aptosAccount = await getAptosAccount()
    const createCollectionTransaction = await aptos.createCollectionTransaction({
        creator: aptosAccount,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
      });
    
    const committedTxn = await aptos.signAndSubmitTransaction({ signer: aptosAccount, transaction: createCollectionTransaction });
    return committedTxn
}

export function buildCollectionURI(){

}