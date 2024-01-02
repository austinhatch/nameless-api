import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { AccountsController } from './accounts.controller';
import { IScannerAuthDTO } from './dtos/scanner-auth.dto';
import { scannerAuthSchema } from './schemas/scanner-auth.schema';

export const accountsRouter = new Router({ prefix: '/accounts' });

accountsRouter.post(
    '/scanner-auth',
    validateRequestBodyMiddleware<IScannerAuthDTO>(scannerAuthSchema.strict()),
    AccountsController.scannerAuth,
  );