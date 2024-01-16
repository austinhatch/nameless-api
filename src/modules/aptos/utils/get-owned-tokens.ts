import { aptos, getAptosAccount } from './aptos-config';

// export async function getOwnedTokensByCollection(
//   accountAddress: string,
//   collectionAddress: string,
// ) {
//   console.log('getOwnedTokensByCollection');
//   const args = {
//     accountAddress: accountAddress,
//       current_token_data: {
//         collection_id: collectionAddress,
//       },
//   };
//   console.log(accountAddress);
//   const ownedTokens = await aptos.getAccountOwnedTokens(args);
//   return ownedTokens;
// }


export async function getOwnedTokensByCollection(
    accountAddress: string,
    collectionAddress: string,
  ) {
    console.log('getOwnedTokensByCollection');
    const args = {
      accountAddress: accountAddress,
      collectionAddress: collectionAddress,
    };
    console.log(accountAddress);
    const ownedTokens = await aptos.getAccountOwnedTokensFromCollectionAddress(args);
    return ownedTokens;
  }