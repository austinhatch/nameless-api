import { aptos, getAptosAccount } from "./aptos-config";
import { pfpConfig } from "./pfp_config";
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
    const structuredResponse = structureTokens(ownedTokens)    
    return structuredResponse
}


function structureTokens(tokens: any[]) {
    const result = tokens.reduce((acc, token) => {
      if (token.current_token_data.collection_id === pfpConfig.collectionAddress) {
        acc.pfp = { pfpToken: token };
      } else {
        acc.rewards.push({ reward: token });
      }
      return acc;
    }, { pfp: null, rewards: [] });
  
    return result;
  }
  