import { RouterContext } from '@koa/router';
import { ISignInDTO } from './dtos/sign-in.dto';
import { ISignUpDTO } from './dtos/sign-up.dto';
import { IUserExistsDTO, IUserPhoneExistsDTO} from './dtos/user-exists.dto';
import {
  generateResetToken,
  generateToken,
  getEmailFromToken,
} from './utils/generate-token';
import { createPrivateKey, reEncryptPrivateKey } from './utils/privateKey';
import { hashPassword } from './utils/hash-password';
import { comparePassword } from './utils/compare-password';
import { UsersRepository } from '../users/users.repository';
import { IForgotDTO } from './dtos/forgot.dto';
import { IResetDTO } from './dtos/reset.dto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

export class AuthController {
  static async signUp(ctx: RouterContext) {
    const { email, password, phone, username } = <ISignUpDTO>(
      JSON.parse(ctx.request.body)
    );
    const existingUser = await UsersRepository.findByEmail(email);
    const existingUserPhone = await UsersRepository.findByPhone(phone)
    if (existingUser) {
      ctx.throw(409, {
        errors: [`user with email ${email} already exists`],
      });
    } 
    else if(existingUserPhone){
      ctx.throw(409, {
        errors: [`user with phone ${phone} already exists`],
      }); 
    }
    
    else {
      const hashedPassword = await hashPassword(password);
      const { walletAddress, privateKey } = await createPrivateKey(
        hashedPassword,
      );
      const user = await UsersRepository.create({
        email,
        phone,
        username,
        walletAddress,
        privateKey,
        password: hashedPassword,
        eventIDs: [],
        rewardIDs: [],
      });
      const token = await generateToken(user);
      ctx.status = 201;
      ctx.body = { user, token };
    }
  }

  static async userExists(ctx: RouterContext) {
    const { email } = <IUserExistsDTO>JSON.parse(ctx.request.body);
    const user = await UsersRepository.findByEmail(email);
    if (!user) {
      ctx.status = 201;
        ctx.body = {
          existing: false
        };
    } 
    else {
        ctx.status = 201;
        ctx.body = {
          user,
          existing: true
        };
      }
    }

    static async userExistsPhone(ctx: RouterContext) {
      const { phone } = <IUserPhoneExistsDTO>JSON.parse(ctx.request.body);
      const user = await UsersRepository.findByPhone(phone);
      console.log(phone, user)
      if (!user) {
        ctx.status = 201;
          ctx.body = {
            existing: false
          };
      } 
      else {
          ctx.status = 201;
          ctx.body = {
            user,
            existing: true
          };
        }
      }
    

  static async signIn(ctx: RouterContext) {
    const { email, phone, password } = <ISignInDTO>JSON.parse(ctx.request.body);
    let user;
    if (email) {
      // user used email
      user = await UsersRepository.findByEmail(email);
    }
    if (phone) {
      // user used phone
      user = await UsersRepository.findByPhone(phone);
    }
    if (!user) {
      ctx.throw(404, { errors: [`user with email ${email} does not exist`] });
    } else {
      const doPasswordsMatch = await comparePassword(password, user.password);
      if (doPasswordsMatch) {
        const token = await generateToken(user);
        ctx.status = 201;
        ctx.body = {
          user,
          token,
          type: 'Bearer',
        };
      } else {
        ctx.throw(401, { errors: ['incorrect password'] });
      }
    }
  }

  // static async signInPhone(ctx: RouterContext) {
  //   const { phone, password } = <ISignInPhoneDTO>JSON.parse(ctx.request.body);
  //   const user = await UsersRepository.findByPhone(phone);
  //   if (!user) {
  //     ctx.throw(404, { errors: [`user with email ${phone} does not exist`] });
  //   } else {
  //     const doPasswordsMatch = await comparePassword(password, user.password);
  //     if (doPasswordsMatch) {
  //       const token = await generateToken(user);
  //       ctx.status = 201;
  //       ctx.body = {
  //         user,
  //         token,
  //         type: 'Bearer',
  //       };
  //     } else {
  //       ctx.throw(401, { errors: ['incorrect password'] });
  //     }
  //   }
  // }



  static async forgot(ctx: RouterContext) {
    const { email } = <IForgotDTO>JSON.parse(ctx.request.body);
    const user = await UsersRepository.findByEmail(email);
    if (!user) {
      ctx.throw(404, { errors: [`user with email ${email} does not exist`] });
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
        const user = await UsersRepository.findByEmail(email);
        if (user) {
          // update private key
          const newPrivKey = await reEncryptPrivateKey(hashedPassword, user);

          const updatedUserData: Prisma.UserUpdateInput = {
            password: hashedPassword,
            privateKey: newPrivKey,
          };
          console.log('userID', user.id);

          UsersRepository.update(user.id, updatedUserData)
            .then((updatedUser) => {
              console.log('User updated:', updatedUser);
            })
            .catch((error) => {
              console.error('Error updating user:', error);
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
