import { RouterContext } from '@koa/router';
import { KYD_UsersRepository } from './kyd_users.repository';

export class UsersController {
  static async list(ctx: RouterContext) {
    const users = await KYD_UsersRepository.findAll();
    ctx.body = users;
  }

  static async detail(ctx: RouterContext) {
    const { user } = ctx.state;
    ctx.body = user;
  }

  static async delete(ctx: RouterContext) {
    await KYD_UsersRepository.delete(ctx.params.id);
    ctx.body = {
      message: 'Deleted',
    };
  }
}
