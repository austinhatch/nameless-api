import { RouterContext } from '@koa/router';
import { IChangeUsernameDTO, ICheckUsernameDTO, IUpdateEmailDTO, IUpdateUserDTO } from './dtos/update-user.dto';
import { UsersRepository } from './users.repository';

export class UsersController {
  static async list(ctx: RouterContext) {
    const users = await UsersRepository.findAll();
    ctx.body = users;
  }

  static async detail(ctx: RouterContext) {
    const { user } = ctx.state;
    ctx.body = user;
  }

  static async update(ctx: RouterContext) {
    const data = <IUpdateUserDTO>ctx.request.body;
    const user = await UsersRepository.update(ctx.params.id, data);
    ctx.body = user;
  }

  static async delete(ctx: RouterContext) {
    await UsersRepository.delete(ctx.params.id);
    ctx.body = {
      message: 'Deleted',
    };
  }

  static async changeUsername(ctx: RouterContext) {
    const { id, username } = <IChangeUsernameDTO>(
      JSON.parse(ctx.request.body)
    );
    const existingUser = await UsersRepository.findByUsername(username)

    if(existingUser){
      ctx.throw(401, 'Username already exists. Please try a different username.');
    }

    else{
      await UsersRepository.update(id, {username:username})
      ctx.status = 201;
      const user = await UsersRepository.findById(id)
      console.log(user)
      ctx.body = {
        user,
      }
    }
  }

  static async updateUserEmail(ctx: RouterContext) {
    console.log('SANUITY CHECK')
    const { email, id } = <IUpdateEmailDTO>(
      JSON.parse(ctx.request.body)
    );

    const existingEmail = await UsersRepository.findByEmail(email)

    if(existingEmail) {
      ctx.throw(409, 'Email already exists')
    }
    else {
      await UsersRepository.update(id, {email})
      ctx.status = 201;
      console.log('before findById')
      const user = await UsersRepository.findById(id)
      console.log(user)
      ctx.body = {
        user,
      }
    }

  }

}
