import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { isCurrentUserMiddleware } from '@/shared/middlewares/authorization/is-current-user.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { UsersController } from './kyd_users.controller';
import { udpateUserSchema } from './schemas/update-user.schema';
import { findUserByHashEmailMiddleware } from './middlewares/find-user-by-email.middleware';
import { findUserByHashPhoneMiddleware } from './middlewares/find-user-by-phone.middleware copy';

export const KYD_UsersRouter = new Router({ prefix: '/kyd_users' });
