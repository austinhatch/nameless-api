import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { Web3Controller } from './web3.controller';
import { IGetContractDTO } from './dtos/get-contract-dto';
import { IMintNFTDTO } from './dtos/mint-nft-dto';

export const web3Router = new Router({ prefix: '/web3' });

web3Router.post(
  '/get-contract',
  Web3Controller.grantContractKey,
);

web3Router.post(
  '/mint-nft',
  Web3Controller.mintNFT,
)

web3Router.post(
  '/mint-reward',
  Web3Controller.mintReward,
)


// authRouter.post(
//   '/sign-in',
// //   validateRequestBodyMiddleware<ISignInDTO>(signInSchema.strict()),
//   AuthController.signIn,
// );
