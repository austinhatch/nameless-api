import { RouterContext } from '@koa/router';
import { Prisma } from '@prisma/client';
import { AccountsRepository } from './accounts.repository';
import { IScannerAuthDTO } from './dtos/scanner-auth.dto';
import { ISignUpDTO } from './dtos/signup.dto';
import { ISignInDTO } from './dtos/signin.dto';
import { IForgotDTO } from './dtos/forgot.dto';
import { IResetDTO } from '../auth/dtos/reset.dto';
import { generateToken } from './utils/generate-token';
import { hashPassword } from '../auth/utils/hash-password';
import { createAccountId } from './utils/create-account-id';
import { comparePassword } from '../auth/utils/compare-password';
import { generateResetToken } from '../auth/utils/generate-token';
import { getEmailFromToken } from '../auth/utils/generate-token';

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

  //The below functions are used for Account creation and authentication
  
  static async signUp(ctx: RouterContext) {
    console.log(JSON.parse(ctx.request.body))
    const { name, email, password } = <ISignUpDTO>(
      JSON.parse(ctx.request.body)
    );
    try {
      const hashedPassword = await hashPassword(password);
      const account_id = createAccountId(name)

      const user = await AccountsRepository.create({
        name,
        email,
        account_id,
        password: hashedPassword,
        created: new Date()
      });
      const token = await generateToken(user);
      ctx.status = 201;
      ctx.body = { user, token };
    }
    catch (e) {

    }
  }

  static async signIn(ctx: RouterContext) {
    const { email, password } = <ISignInDTO>JSON.parse(ctx.request.body);
    let account = await AccountsRepository.findByEmail(email);
    if (!account) {
      ctx.throw(404, { errors: [`account with email ${email} does not exist`] });
    } 
    else {
      const doPasswordsMatch = await comparePassword(password, account.password);
      if (doPasswordsMatch) {
        const token = await generateToken(account);
        ctx.status = 201;
        ctx.body = {
          account,
          token,
          type: 'Bearer',
        };
      } 
      else {
        ctx.throw(400, { errors: ['incorrect code'] });
      }
    }
  }

  static async forgot(ctx: RouterContext) {
    const { email } = <IForgotDTO>JSON.parse(ctx.request.body);
    const account = await AccountsRepository.findByEmail(email);
    if (!account) {
      ctx.throw(404, { errors: [`account with email ${email} does not exist`] });
    } else {
      const token = generateResetToken(email);
      ctx.status = 201;
      ctx.body = {
        email,
        token,
        type: 'Bearer',
      };
      const mailchimp = require('@mailchimp/mailchimp_transactional')(
        process.env.MAILCHIMP_API,
      );
      let url;
      if (process.env.ENV == "local") {
        url = 'http://localhost:5173/auth?resetToken=' + token;
      } else if (process.env.ENV == "dev") {
        url = 'https://nameless-beta.com/auth?resetToken=' + token;
      } else {
        url = 'https://nameless.nyc/auth?resetToken=' + token;
      }

      const message = {
        from_email: 'nameless@nameless.nyc',
        subject: 'Password Reset',
        text: `please use this link to reset your password:  ${url}`,
        to: [
          {
            email: email,
            type: 'to',
          },
        ],
      };

      async function run() {
        const response = await mailchimp.messages.send({ message: message });
        console.log(response);
      }
      run();
    }
  }

  static async reset(ctx: RouterContext) {
    const { password, confirmPassword } = <IResetDTO>(
      JSON.parse(ctx.request.body)
    );

    const authorizationHeader = ctx.request.headers.authorization;
    if (!authorizationHeader) {
      // Handle missing bearer token error
      ctx.throw(401, 'Bearer token is missing');
    }

    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      // Handle invalid bearer token format error
      ctx.throw(401, 'Invalid bearer token');
    } else {
      try {
        const email = getEmailFromToken(token);
        const hashedPassword = await hashPassword(password);
        const account = await AccountsRepository.findByEmail(email);
        if (account) {
          const updatedAccountData: Prisma.AccountsUpdateInput = {
            password: hashedPassword,
          };

          AccountsRepository.update(account.id, updatedAccountData)
            .then((updatedAccount) => {
              console.log('Account updated:', updatedAccount);
            })
            .catch((error) => {
              console.error('Error updating account:', error);
              throw error;
            });
        }
        ctx.status = 201;
      } catch (error) {
        console.log(error);
        ctx.throw(401, `Token expired/email invalid ${error} `);
      }
    }
  }
}
