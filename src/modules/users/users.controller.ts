import { RouterContext } from '@koa/router';
import { IChangeUsernameDTO, ICheckUsernameDTO, IUpdateEmailDTO, IUpdateUserDTO, IUpdatePFPDTO, IAddEventDTO, IAddRewardDTO, IUpdateNameDTO } from './dtos/update-user.dto';
import { IGetPFPDTO } from './dtos/get-user.dto';
import { UsersRepository } from './users.repository';
import { sdk } from '../web3/utils/thirdweb-config';
import { useOwnedNFTs } from '@thirdweb-dev/react';

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

  static async changePFP(ctx: RouterContext) {
    console.log("Change PFP")
    const { id, pfpAddress, chain } = <IUpdatePFPDTO>(
      JSON.parse(ctx.request.body)
    );

    await UsersRepository.update(id, {pfpAddress:{address: pfpAddress, chain: chain}})
    ctx.status = 201;
    const user = await UsersRepository.findById(id)
    ctx.body = {
      user,
    }
  }

  static async updateName(ctx: RouterContext) {
    console.log("Update Name")
    const { id, name, lastName } = <IUpdateNameDTO>(
      JSON.parse(ctx.request.body)
    );

    await UsersRepository.update(id, {name: name, lastName: lastName})
    ctx.status = 201;
    const user = await UsersRepository.findById(id)
    ctx.body = {
      user,
    }
  }

  static async addRewardId(ctx: RouterContext) {
    const { id, rewardId  } = <IAddRewardDTO>(
      JSON.parse(ctx.request.body)
    );
    console.log(`Add Event Id ${rewardId} to User ${id}`)
    const user = await UsersRepository.findById(id)
    if (user && !user.rewardIDs.includes(rewardId)) {
      await UsersRepository.updateRewardIDs(rewardId, id)
    }
    ctx.status = 201;
    ctx.body = {
      user,
    }
  }

  static async addEventId(ctx: RouterContext) {
    const { id, eventId  } = <IAddEventDTO>(
      JSON.parse(ctx.request.body)
    );
    console.log(`Add Event Id ${eventId} to User ${id}`)
    const user = await UsersRepository.findById(id)
    if (user && !user.eventIDs.includes(eventId)) {
      await UsersRepository.updateEventIDs(eventId, id)
    }
    ctx.status = 201;
    ctx.body = {
      user,
    }
  }
}
