import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { stripeController } from './stripe.controller';


export const stripeRouter = new Router({ prefix: '/stripe' });

stripeRouter.post(
  '/create-payment-intent',
//   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  stripeController.createPaymentIntent,
);

stripeRouter.post(
  '/apply-promo-code',
  stripeController.applyPromoCode,
);

stripeRouter.post(
  '/update-promise',
  stripeController.updatePromise,
)



// authRouter.post(
//   '/sign-in',
// //   validateRequestBodyMiddleware<ISignInDTO>(signInSchema.strict()),
//   AuthController.signIn,
// );
