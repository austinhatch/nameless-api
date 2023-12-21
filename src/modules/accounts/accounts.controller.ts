import { RouterContext } from '@koa/router';
import { AccountsRepository } from './accounts.repository';


export class AccountsController {
  static async list(ctx: RouterContext) {
    const users = await AccountsRepository.findAll();
    ctx.body = users;
  }

  static async detail(ctx: RouterContext) {
    const { user } = ctx.state;
    ctx.body = user;
  }

  static async scannerAuth(ctx: RouterContext){
    const { accountId, pin } = <IScannerAuthDTO>JSON.parse(ctx.request.body)
  
  }

  static async delete(ctx: RouterContext) {
    await AccountsRepository.delete(ctx.params.id);
    ctx.body = {
      message: 'Deleted',
    };
  }
}
