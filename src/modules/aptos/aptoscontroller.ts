import { RouterContext } from '@koa/router';
import { IMintPFPDTO } from './dtos/mint-pfp-dto';
import { IMintRewardDTO } from './dtos/mint-reward-dto';
import { ICreateCollectionDTO } from './dtos/create-collection-dto';
import { createCollection } from './utils/create-collection';
import { createAccount } from './utils/create-account';
import { createToken } from './utils/create-token';
import BigNumber from 'bignumber.js';
import { IGetOwnedTokensByCollectionDTO, IGetOwnedTokensDTO } from './dtos/get-owned-tokens-dto';
import { getOwnedTokensByCollection, getOwnedTokens } from './utils/get-owned-tokens';
import { pfpConfig } from './utils/pfp_config';
import pfpURIs from './uris/pfp-uris.json';
import { string } from 'yup';
import { EventsRepository } from '../events/events.repository';
import { Event } from '@prisma/client';

interface URIConfig {
  [key: string]: string;
}

interface RewardInfo {
  description: string;
  name: string;
  uri: string;
  // ... other properties relevant to the reward
}

type JsonObject = { [key: string]: any };

const uris: URIConfig = pfpURIs as URIConfig;

export class AptosController {
  static async createCollection(ctx: RouterContext) {
    console.log(ctx.request.body);
    const { collectionName, collectionDescription, collectionURI } = <
      ICreateCollectionDTO
    >JSON.parse(ctx.request.body);
    try {
      const collection = await createCollection(
        collectionName,
        collectionDescription,
        collectionURI,
      );
      ctx.status = 201;
      ctx.body = {
        message: `Succesfully minted a collection ${collectionName}`,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async mintPFP(ctx: RouterContext) {
    console.log('minting pfp!!!!!!');
    const { address, uri_id  } = <IMintPFPDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const config = pfpConfig;
      const uri = uris[uri_id];
      const ownedTokens = await getOwnedTokensByCollection(address, config.collectionAddress)
      console.log(address, config.collection, config.description, config.name, uri)
      if(!ownedTokens || ownedTokens.length == 0){
        const nft = await createToken(address, config.collection, config.description, config.name, uri);
        console.log(nft);
        ctx.status = 201;
        ctx.body = {
          message: `Succesfully minted an NFT for contract to collection ${config.collection}`,
          collectionAddress: config.collectionAddress,
        };
      }
    } catch (e: any) {
      ctx.status = 500;
      console.log('+++++++++++++++++', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async mintReward(ctx: RouterContext) {
    console.log('minting reward!!!!!!');
    const { accountAddress, eventId, collectionAddress } = <IMintRewardDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const event: Event | null = await EventsRepository.findById(eventId)
      if (event && event.rewards && typeof event.rewards === 'object' && !Array.isArray(event.rewards)) {
        const rewards: JsonObject = event.rewards;
        const rewardInfo: RewardInfo | undefined = rewards[collectionAddress];

        console.log('calling create token');
        if(rewardInfo){
          const ownedTokens = await getOwnedTokensByCollection(accountAddress, collectionAddress)
          if(!ownedTokens || ownedTokens.length == 0){
            const nft = await createToken(accountAddress, collectionAddress, rewardInfo.description, rewardInfo.name, rewardInfo.uri);

          console.log(nft);
          ctx.status = 201;
          ctx.body = {
            message: `Succesfully minted an NFT for contract to collection ${collectionAddress}`,
            collectionAddress: collectionAddress,
          };
        }
      }
    }
    } catch (e: any) {
      ctx.status = 500;
      console.log('+++++++++++++++++', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async getOwnedTokensByCollection(ctx: RouterContext) {
    const { accountAddress, collectionAddress } = <IGetOwnedTokensByCollectionDTO>(
      JSON.parse(ctx.request.body)
    );
    console.log(accountAddress, collectionAddress)
    
    try {
      const ownedTokens = await getOwnedTokensByCollection(
        accountAddress,
        collectionAddress,
      );
      ctx.status = 201;
      ctx.body = {
        ownedTokens,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async getOwnedTokens(ctx: RouterContext) {
    const { accountAddress } = <IGetOwnedTokensDTO>(
      JSON.parse(ctx.request.body)
    );
    console.log(accountAddress)
    
    try {
      const ownedTokens = await getOwnedTokens(
        accountAddress,
      );
      ctx.status = 201;
      ctx.body = {
        ownedTokens,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async createAccount(ctx: RouterContext) {
    // console.log("********")
    // console.log(ctx.request.body)
    const accountAddress = ctx.request.body.accountAddress;

    try {
      const accountCreation = await createAccount(accountAddress);
      ctx.status = 201;
      ctx.body = {
        accountCreation,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }
}
