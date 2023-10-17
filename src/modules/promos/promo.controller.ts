import Router, { RouterContext } from '@koa/router';
import { Request } from 'koa';
// import { IUpdateUserDTO } from './dtos/update-user.dto';
// import { IRewardDTO } from './dtos/reward.dto'
import { PromoCodesRepository } from './promo.repository';
import { UsersRepository } from '../users/users.repository';
import { EventsRepository } from '../events/events.repository';

export class PromoCodesController {
  static async list(ctx: RouterContext) {
    const Rewards = await PromoCodesRepository.findAll();
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

  static async findAllByEventId(ctx: RouterContext) {
    const res = await PromoCodesRepository.findAllByEventId(ctx.params.id)
    ctx.body = res
  }

  static async updateEventIDs(ctx: RouterContext) {
    const eventId = <string>JSON.parse(ctx.request.body).id
    const res = await PromoCodesRepository.updateEventIDs(ctx.params.id, eventId)
    const userRes = await EventsRepository.updatePromoCodeIDs(ctx.params.id, eventId)
    ctx.body = {res, userRes};
  }

  static async create(ctx: RouterContext) {
    const  {body} = <Request>ctx.request;
    const parsed = JSON.parse(body)
    const event = await PromoCodesRepository.create(
      {
        code: parsed.name,
        percent: parsed.percent,
        amount: parsed.amount,
      }
    )
    ctx.status = 201;
    ctx.body = event;
  }
}
