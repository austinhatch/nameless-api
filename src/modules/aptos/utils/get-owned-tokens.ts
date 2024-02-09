import { aptos, getAptosAccount, getSequenceNumber } from './aptos-config';
import { pfpConfig } from './pfp_config';
import { environment } from '@/config/environment';
import { ViewRequest, MoveValue } from '@aptos-labs/ts-sdk';

export async function getOwnedTokensByCollection(
  accountAddress: string,
  collectionAddress: string,
) {
  const args = {
    accountAddress: accountAddress,
    collectionAddress: collectionAddress,
  };
  const ownedTokens = await aptos.getAccountOwnedTokensFromCollectionAddress(
    args,
  );
  return ownedTokens;
}

export async function getOwnedTokens(accountAddress: string) {
  const args = {
    accountAddress: accountAddress,
  };
  const ownedTokens = await aptos.getAccountOwnedTokens(args);
  const structuredResponse = await structureTokens(ownedTokens);
  return structuredResponse;
}

async function structureTokens(tokens: any[]) {
  const result = await tokens.reduce(async (accPromise, token) => {
    const acc = await accPromise;

    if (token.current_token_data.collection_id === pfpConfig.collectionAddress) {
      acc.pfp = { pfpToken: token };
    } else {
      const rewardWithAttend = await getRewardStatus(token);
      acc.rewards.push({ reward: rewardWithAttend });
    }

    return acc;
  }, Promise.resolve({ pfp: null, rewards: [] }));

  return result;
}

async function getRewardStatus(reward: any) {
  let addr: `${string}`;
  if (environment.aptos_chain === 'MAIN') {
    addr = `0x446bf99aae1f79ccb52df29e083c971d96e49c9bb088834b939a1f0ef341cf13`;
  } else {
    addr = `0x4085614bac67f35aaa8843566633d3b05e182e53af02bad646e42cf734e68afd`;
  }

  const payload: ViewRequest = {
    function: `${addr}::my_management::view_ticket`,
    typeArguments: [],
    functionArguments: [
      addr,
      reward.current_token_data.current_collection.collection_name,
      reward.current_token_data.token_name,
    ],
  };

  const response: MoveValue[] = await aptos.view({ payload });
  // Check if the array is not empty and if the first element is an object with the attended_at property
  if (response.length > 0 && typeof response[0] === 'object') {
    const attendedAtValue: string = (response[0] as { attended_at: string }).attended_at;
    // Now you can use attendedAtValue as needed
    reward.attended_at = attendedAtValue;
    return reward
  } else {
    console.log("attended_at is null or undefined");
    return reward
  }

  
}
