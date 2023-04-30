import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { AuthController } from './auth.controller';
import { ISignInDTO } from './dtos/sign-in.dto';
import { ISignUpDTO } from './dtos/sign-up.dto';
import { signUpSchema } from './schemas/sign-up.schema';
import { signInSchema } from './schemas/sign-in.schema';

export const authRouter = new Router({ prefix: '/auth' });

authRouter.post(
  '/sign-up',
  validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  AuthController.signUp,
);

authRouter.post(
  '/sign-in',
  validateRequestBodyMiddleware<ISignInDTO>(signInSchema.strict()),
  AuthController.signIn,
);
