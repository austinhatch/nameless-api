import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { Web3Controller } from './web3.controller';
// import { ISignInDTO } from './dtos/sign-in.dto';
// import { ISignUpDTO } from './dtos/sign-up.dto';
// import { signUpSchema } from './schemas/sign-up.schema';
// import { signInSchema } from './schemas/sign-in.schema';

export const web3Router = new Router({ prefix: '/web3' });

web3Router.post(
  '/get-contract',
//   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  Web3Controller.grantContractKey,
);

web3Router.post(
  '/mint-nft',
  //   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  Web3Controller.mintNFT,
)

// authRouter.post(
//   '/sign-in',
// //   validateRequestBodyMiddleware<ISignInDTO>(signInSchema.strict()),
//   AuthController.signIn,
// );
