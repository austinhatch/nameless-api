import Router from '@koa/router';
import { object, string, ref } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { AffiliatesController } from './affiliates.controller';
import { affiliateLinkCreationSchema } from './schemas/link-create.schema';
import { IAffiliateLinkCreationDTO } from './dtos/link-create.dto';

export const authRouter = new Router({ prefix: '/affiliates' });

authRouter.post(
  '/get-link',
  validateRequestBodyMiddleware<IAffiliateLinkCreationDTO>(affiliateLinkCreationSchema.strict()),
  AffiliatesController.createLink,
);
