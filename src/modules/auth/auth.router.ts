import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { AuthController } from './auth.controller';
import { ISignInDTO, ISignInPhoneDTO } from './dtos/sign-in.dto';
import { ISignUpDTO } from './dtos/sign-up.dto';
import { IForgotDTO } from './dtos/forgot.dto';
import { IResetDTO } from './dtos/reset.dto';
import { IUserExistsDTO, IUserPhoneExistsDTO } from './dtos/user-exists.dto';
import { signUpSchema } from './schemas/sign-up.schema';
import { signInSchema, signInPhoneSchema } from './schemas/sign-in.schema';
import { forgotSchema } from './schemas/forgot.schema';
import { resetSchema } from './schemas/reset.schema';
import { userExistsSchema, userExistsPhoneSchema } from './schemas/user-exists.schema';

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
  '/sign-in-phone',
  validateRequestBodyMiddleware<ISignInPhoneDTO>(signInPhoneSchema.strict()),
  AuthController.signInPhone,
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

authRouter.post(
  '/check-user',
  validateRequestBodyMiddleware<IUserExistsDTO>(userExistsSchema.strict()),
  AuthController.userExists,

)

authRouter.post(
  '/check-user-phone',
  validateRequestBodyMiddleware<IUserPhoneExistsDTO>(userExistsPhoneSchema.strict()),
  AuthController.userExistsPhone,
)