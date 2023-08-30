import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { AuthController } from './auth.controller';
import { ISignInDTO } from './dtos/sign-in.dto';
import { ISignUpDTO } from './dtos/sign-up.dto';
import { IForgotDTO } from './dtos/forgot.dto';
import { IResetDTO } from './dtos/reset.dto';
import { signUpSchema } from './schemas/sign-up.schema';
import { signInSchema } from './schemas/sign-in.schema';
import { forgotSchema } from './schemas/forgot.schema';
import { resetSchema } from './schemas/reset.schema';

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

authRouter.post(
  '/forgot',
  validateRequestBodyMiddleware<IForgotDTO>(forgotSchema.strict()),
  AuthController.forgot,
);

authRouter.post(
  '/reset',
  validateRequestBodyMiddleware<IResetDTO>(resetSchema.strict()),
  AuthController.reset,
);
