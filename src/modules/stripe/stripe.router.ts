import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { stripeController } from './stripe.controller';
// import { ISignInDTO } from './dtos/sign-in.dto';
// import { ISignUpDTO } from './dtos/sign-up.dto';
// import { signUpSchema } from './schemas/sign-up.schema';
// import { signInSchema } from './schemas/sign-in.schema';

export const stripeRouter = new Router({ prefix: '/stripe' });

stripeRouter.post(
  '/create-payment-intent',
//   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  stripeController.createPaymentIntent,
);


// authRouter.post(
//   '/sign-in',
// //   validateRequestBodyMiddleware<ISignInDTO>(signInSchema.strict()),
//   AuthController.signIn,
// );
