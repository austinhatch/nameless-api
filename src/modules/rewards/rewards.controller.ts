import { RouterContext } from '@koa/router';
import { Request } from 'koa';
// import { IUpdateUserDTO } from './dtos/update-user.dto';
// import { IRewardDTO } from './dtos/reward.dto'
import { RewardsRepository } from './rewards.repository';

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

  static async updateUserIDs(ctx: RouterContext) {
    const userID = <string>ctx.request.body.id || 'test'
    const res = await RewardsRepository.updateUserIDs(ctx.params.id, userID)
    ctx.body = res;
  }

  static async create(ctx: RouterContext) {
    const  {body} = <Request>ctx.request;
    const event = await RewardsRepository.create(
      {
        name: body.name!,
        description: body.description!,
        imgUrl: body.imgUrl!
      }
    )
    ctx.status = 201;
    ctx.body = event;
  }
}
