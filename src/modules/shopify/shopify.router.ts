import Router from '@koa/router';
// import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { shopifyController } from './shopify.controller';

export const shopifyRouter = new Router({ prefix: '/shopify' });

shopifyRouter.get(
  '/get-all-products',
  //   validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  shopifyController.getAllProducts,
);
