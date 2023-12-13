import { RouterContext } from '@koa/router';
import { IMintNFTDTO } from './dtos/mint-nft-dto';
import { ICreateCollectionDTO } from './dtos/create-collection-dto';
import { createCollection } from './utils/create-collection';
import { mintNFT } from './utils/mint-nft';
import BigNumber from 'bignumber.js';
import { IGetOwnedTokensDTO } from './dtos/get-owned-tokens-dto';
import { getOwnedTokensByCollection } from './utils/get-owned-tokens';

export class AptosController {
  static async createCollection(ctx: RouterContext) {
    console.log(ctx.request.body)
    const { collectionName, collectionDescription, collectionURI } = <ICreateCollectionDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const collection = await createCollection(collectionName, collectionDescription, collectionURI);
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

  static async mintNFT(ctx: RouterContext) {
    const { collection, description, name, uri } = <IMintNFTDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const nft = await mintNFT(collection, description, name, uri);
      ctx.status = 201;
      ctx.body = {
        message: `Succesfully minted an NFT for contract to collection ${collection}`,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async getOwnedTokensByCollection(ctx: RouterContext) {
    const { accountAddress, collectionAddress } = <IGetOwnedTokensDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const ownedTokens = await getOwnedTokensByCollection(accountAddress, collectionAddress);
      ctx.status = 201;
      ctx.body = {
        ownedTokens
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }
}
