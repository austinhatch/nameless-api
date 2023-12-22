import { RouterContext } from '@koa/router';
import { AccountsRepository } from './accounts.repository';
import { IScannerAuthDTO } from './dtos/scanner-auth.dto';
import { generateToken } from './utils/generate-token';

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
    const account = await AccountsRepository.findByAccountId(accountId)
    if(account){
      if(account.scanner_pin === pin){
          const token = await generateToken(account);
          ctx.status = 201;
          ctx.body = {accountId, token}
      }
      else {
        ctx.throw(409, {
          errors: [`Invalid pin for ${accountId}.`],
        }); 
      }
    }
    else{
      ctx.throw(409, {
        errors: [`No account exists for ${accountId}. Please contact your Nameless Representative`],
      });
    }
  }

  static async delete(ctx: RouterContext) {
    await AccountsRepository.delete(ctx.params.id);
    ctx.body = {
      message: 'Deleted',
    };
  }
}
