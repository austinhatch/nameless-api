import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { AccountsController } from './accounts.controller';
import { IScannerAuthDTO } from './dtos/scanner-auth.dto';
import { ISignUpDTO } from './dtos/signup.dto';
import { ISignInDTO } from './dtos/signin.dto';
import { IForgotDTO } from './dtos/forgot.dto';
import { IResetDTO } from '../auth/dtos/reset.dto';

import { scannerAuthSchema } from './schemas/scanner-auth.schema';
import { signUpSchema } from './schemas/sign-up.schema';
import { signInSchema } from './schemas/sign-in.schema';
import { forgotSchema } from './schemas/forgot.schema';
import { resetSchema } from './schemas/reset.schema';

export const accountsRouter = new Router({ prefix: '/accounts' });

accountsRouter.post(
  '/scanner-auth',
  validateRequestBodyMiddleware<IScannerAuthDTO>(scannerAuthSchema.strict()),
  AccountsController.scannerAuth,
);

accountsRouter.post(
  '/sign-up',
  validateRequestBodyMiddleware<ISignUpDTO>(signUpSchema.strict()),
  AccountsController.signUp,
);

accountsRouter.post(
  '/sign-in',
  validateRequestBodyMiddleware<ISignInDTO>(signInSchema.strict()),
  AccountsController.signIn,
);

accountsRouter.post(
  '/forgot',
  validateRequestBodyMiddleware<IForgotDTO>(forgotSchema.strict()),
  AccountsController.forgot,
);

accountsRouter.post(
  '/reset',
  validateRequestBodyMiddleware<IResetDTO>(resetSchema.strict()),
  AccountsController.reset,
);