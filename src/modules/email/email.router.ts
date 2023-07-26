import Router from '@koa/router';
import { EmailController } from './email.controller';

export const emailRouter = new Router({ prefix: '/email' });

emailRouter.post('/create', EmailController.create);
