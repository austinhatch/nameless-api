import { RouterContext } from '@koa/router';
// import { ISignInDTO } from './dtos/sign-in.dto';
// import { ISignUpDTO } from './dtos/sign-up.dto';
// import { generateToken } from './utils/generate-token';
// import { hashPassword } from './utils/hash-password';
// import { comparePassword } from './utils/compare-password';
// import { UsersRepository } from '../users/users.repository';
import { IGetContractDTO } from './dtos/get-contract-dto';
import { IMintNFTDTO } from './dtos/mint-nft-dto';
import { sdk, calcExpiryDate } from './utils/thirdweb-config';
import { publicLock } from './utils/PublicLock';
import BigNumber from 'bignumber.js';

export class Web3Controller {
  static async grantContractKey(ctx: RouterContext) {
    const { event, walletAddress, num } = <IGetContractDTO>(
      JSON.parse(ctx.request.body)
    );

    try {
      const contract = await sdk.getContract(event.lockAddress, publicLock);

      const subscribed = await contract.call('getHasValidKey', [walletAddress]);
      console.log("Minting ", num )
      const addresses= new Array(num).fill(walletAddress)
      console.log(addresses)
      const dates = new Array(num).fill(calcExpiryDate(event))
      console.log(dates)
      // for (let i: number = 0; i < num; i++) {
      const tx = await contract.call('grantKeys', [
          addresses,
          dates,
          addresses,
        ]);
        const transfers = tx.receipt.events.filter( (item: { event: string; }) => item.event === 'Transfer')
        const keys = []
        for(const t of transfers){
          console.log(t.args)
          const id_hex = t.args[2]._hex
          console.log("IDHEX",id_hex)
          const bn = new BigNumber(id_hex)
          const id_int = bn.toNumber()
          keys.push(id_int)
        }
      //}
      ctx.status = 201;
      ctx.body = {
        message: `Succesfully granted key for contract with address ${event.lockAddress}`,
        keys: keys
      };
    } catch (e: any) {
      console.log(e)
      ctx.status = 500;
      ctx.body = { message: e.message };
    }
  }

  static async mintNFT(ctx: RouterContext) {
    const { nftAddress, metadata, walletAddress, tokenId } = <IMintNFTDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const contract = await sdk.getContract(nftAddress);
      await contract.call('safeTransferFrom', [
        '0xF12812B592ccDe90d2FdDa913399eC868B66b840',
        walletAddress,
        tokenId,
        1,
        metadata,
      ]);
      ctx.status = 201;
      ctx.body = {
        message: `Succesfully minted an NFT for contract with address ${nftAddress}`,
      };
    } catch (e: any) {
      ctx.status = 500;
      console.log('*******', e.message);
      ctx.body = { message: e.message };
    }
  }
}
