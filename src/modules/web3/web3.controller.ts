import { RouterContext } from '@koa/router';
// import { ISignInDTO } from './dtos/sign-in.dto';
// import { ISignUpDTO } from './dtos/sign-up.dto';
// import { generateToken } from './utils/generate-token';
// import { hashPassword } from './utils/hash-password';
// import { comparePassword } from './utils/compare-password';
// import { UsersRepository } from '../users/users.repository';
import { IGetContractDTO } from './dtos/get-contract-dto'
import { IMintNFTDTO } from './dtos/mint-nft-dto';
import { sdk, calcExpiryDate } from './utils/thirdweb-config'
import {publicLock} from './utils/PublicLock'

export class Web3Controller {

    static async grantContractKey(ctx: RouterContext) {
        const { event, walletAddress } = <IGetContractDTO>JSON.parse(ctx.request.body)

        try {
            const contract = await sdk.getContract(event.lockAddress, publicLock)

            const subscribed = await contract.call(
                "getHasValidKey",
                [
                   walletAddress,
                ],
             );
            
             if (!subscribed) {
                await contract.call(
                   "grantKeys",
                   [
                      [walletAddress],
                      [calcExpiryDate(event)],
                      [walletAddress]]
                );
             }
             ctx.status = 201
             ctx.body = { message: `Succesfully granted key for contract with address ${event.lockAddress}`}
        }
        catch (e: any) {
            ctx.status = 500
            ctx.body = {message: e.message}
        } 
    }

    static async mintNFT(ctx: RouterContext) {
        const { nftAddress, metadata, walletAddress } = <IMintNFTDTO>JSON.parse(ctx.request.body)

        try {
            const contract = await sdk.getContract(nftAddress, "nft-collection")
            await contract.erc721.mintTo(walletAddress, metadata)
            ctx.status = 201
            ctx.body = { message: `Succesfully minted an NFT for contract with address ${nftAddress}`}
        }
        catch (e: any) {
            ctx.status = 500
            ctx.body = {message: e.message}
        } 
    }

}
