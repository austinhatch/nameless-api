import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { KYD_UsersRepository } from '../kyd_users.repository';
import { sha256Hash } from '../utils/sha256_hash';

export async function findUserByHashEmailMiddleware(ctx: RouterContext, next: Next) {
  const { email } = ctx.params;
  const emailHash = sha256Hash(email)
  const user = await KYD_UsersRepository.findById(emailHash);
  if (!user) {
    ctx.throw(404, { errors: [`user with email hash ${emailHash} does not exist`] });
  } else {
    ctx.state.user = user;
    await next();
  }
}
