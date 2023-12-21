import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { AccountsRepository } from '../accounts.repository';

export async function findUserByHashPhoneMiddleware(ctx: RouterContext, next: Next) {
  const { email } = ctx.params;
  const user = await AccountsRepository.findByEmail(email);
  if (!user) {
    ctx.throw(404, { errors: [`account with email ${email} does not exist`] });
  } else {
    ctx.state.user = user;
    await next();
  }
}