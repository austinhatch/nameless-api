import { aptos, getAptosAccount } from "./aptos-config";

export async function getOwnedTokensByCollection( accountAddress: string, collectionAddress: string){
    const args = {
        accountAddress: accountAddress,
        collectionAddress: collectionAddress
    }
    const ownedTokens = await aptos.getAccountOwnedTokensFromCollectionAddress(args)
    return ownedTokens
}