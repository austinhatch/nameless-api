import { aptos, getAptosAccount } from "./aptos-config";

export async function getOwnedTokensByCollection( accountAddress: string, collectionAddress: string){
    const args = {
        accountAddress: accountAddress,
        collectionAddress: collectionAddress
    }
    const ownedTokens = await aptos.getAccountOwnedTokensFromCollectionAddress(args)
    return ownedTokens
}

export async function getOwnedTokens( accountAddress: string){
    const args = {
        accountAddress: accountAddress,
    }
    const ownedTokens = await aptos.getAccountOwnedTokens(args)
    return ownedTokens
}