import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { KYD_UsersRepository } from '../kyd_users.repository';
import { sha256Hash } from '../utils/sha256_hash';

export async function findUserByHashPhoneMiddleware(ctx: RouterContext, next: Next) {
  const { phone } = ctx.params;
  const phoneHash = sha256Hash(phone)
  const user = await KYD_UsersRepository.findById(phone);
  if (!user) {
    ctx.throw(404, { errors: [`user with phone hash ${phoneHash} does not exist`] });
  } else {
    ctx.state.user = user;
    await next();
  }
}