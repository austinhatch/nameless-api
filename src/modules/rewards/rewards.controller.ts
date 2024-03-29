import Router, { RouterContext } from '@koa/router';
import { Request } from 'koa';
// import { IUpdateUserDTO } from './dtos/update-user.dto';
// import { IRewardDTO } from './dtos/reward.dto'
import { RewardsRepository } from './rewards.repository';
import { UsersRepository } from '../users/users.repository';

export class RewardsController {
  static async list(ctx: RouterContext) {
    const Rewards = await RewardsRepository.findAll();
    ctx.body = Rewards;
  }

  static async detail(ctx: RouterContext) {
    const { event } = ctx.state;
    ctx.body = event;
  }

//   static async update(ctx: RouterContext) {
//     const data = <IUpdateEventDTO>ctx.request.body;
//     const user = await EventsRepository.update(ctx.params.id, data);
//     ctx.body = user;
//   }

  // static async delete(ctx: RouterContext) {
  //   await RewardsRepository.delete(ctx.params.id);
  //   ctx.body = {
  //     message: 'Deleted',
  //   };
  // }

  static async findAllByUserId(ctx: RouterContext) {
    const res = await RewardsRepository.findAllByUserId(ctx.params.id)
    ctx.body = res
  }

  static async updateUserIDs(ctx: RouterContext) {
    const userID = <string>JSON.parse(ctx.request.body).id
    const res = await RewardsRepository.updateUserIDs(ctx.params.id, userID)
    const userRes = await UsersRepository.updateRewardIDs(ctx.params.id, userID)
    ctx.body = {res, userRes};
  }

  static async create(ctx: RouterContext) {
    const  {body} = <Request>ctx.request;
    const parsed = JSON.parse(body)
    const event = await RewardsRepository.create(
      {
        name: parsed.name,
        description: parsed.description,
        imgUrl: parsed.imgUrl,
        address: parsed.address,
        chain: parsed.chain
      }
    )
    ctx.status = 201;
    ctx.body = event;
  }
}
