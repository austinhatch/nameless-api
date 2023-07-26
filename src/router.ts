import Router, { RouterContext } from '@koa/router';
import jwt from 'koa-jwt';
import { environment } from '@/config/environment';
import { usersRouter } from './modules/users/users.router';
import { authRouter } from './modules/auth/auth.router';
import { eventsRouter } from './modules/events/events.router';
import { emailRouter } from './modules/email/email.router';
import { rewardsRouter } from './modules/rewards/rewards.router';
import { web3Router } from './modules/web3/web3router';

export const router = new Router({ prefix: '/api' });

router.get('/', (ctx: RouterContext) => {
  ctx.body = {
    message: `${environment.app.name} API`,
  };
});

router.use(authRouter.routes());

router.use(jwt({ secret: environment.jwt.secret, key: 'authData' }));

router.use(usersRouter.routes());
router.use(eventsRouter.routes());
router.use(rewardsRouter.routes());
router.use(web3Router.routes());
router.use(emailRouter.routes());
