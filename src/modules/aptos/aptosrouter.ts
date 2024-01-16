import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { AptosController } from './aptoscontroller';
// import { ISignInDTO } from './dtos/sign-in.dto';
// import { ISignUpDTO } from './dtos/sign-up.dto';
// import { signUpSchema } from './schemas/sign-up.schema';
// import { signInSchema } from './schemas/sign-in.schema';

export const aptosRouter = new Router({ prefix: '/aptos' });

aptosRouter.post(
  '/create-collection',
//   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  AptosController.createCollection,
);

aptosRouter.post(
  '/mint-nft',
  //   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  AptosController.mintNFT,
)

aptosRouter.post(
  '/get-owned-tokens',
  AptosController.getOwnedTokensByCollection,
)


aptosRouter.post('/mint-ticket', AptosController.mintTicket)
