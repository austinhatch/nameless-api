import { RouterContext } from '@koa/router';
import { IMintPFPDTO } from './dtos/mint-pfp-dto';
import { ICreateCollectionDTO } from './dtos/create-collection-dto';
import { createCollection } from './utils/create-collection';
import { createAccount } from './utils/create-account';
import { createToken } from './utils/create-token';
import BigNumber from 'bignumber.js';
import { IGetOwnedTokensDTO } from './dtos/get-owned-tokens-dto';
import { getOwnedTokensByCollection } from './utils/get-owned-tokens';
import { pfpConfig } from './utils/pfp_config';
import pfpURIs from './uris/pfp-uris.json';
import { string } from 'yup';

interface URIConfig {
  [key: string]: string;
}

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
      console.log('calling create token');
      // const nft = await createToken(address, config.collection, config.description, config.name, uri);
      const nft = await createToken(address, config.collection, config.description, config.name, uri);
      console.log(nft);
      ctx.status = 201;
      ctx.body = {
        message: `Succesfully minted an NFT for contract to collection ${config.collection}`,
        collectionAddress: config.collectionAddress,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('+++++++++++++++++', e.message);
      ctx.body = { message: e.message };
    }
  }

  static async getOwnedTokensByCollection(ctx: RouterContext) {
    const { accountAddress, collectionAddress } = <IGetOwnedTokensDTO>(
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
