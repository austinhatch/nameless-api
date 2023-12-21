import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { AccountsRepository } from '../accounts.repository';

export async function findAccountByAccountId(ctx: RouterContext, next: Next) {
  const { accountId } = ctx.params;
  const user = await AccountsRepository.findByAccountId(accountId);
  if (!user) {
    ctx.throw(404, { errors: [`account with id ${accountId} does not exist`] });
  } else {
    ctx.state.user = user;
    await next();
  }
}
