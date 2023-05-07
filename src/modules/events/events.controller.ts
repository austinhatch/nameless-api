import { RouterContext } from '@koa/router';
import { Request } from 'koa';
// import { IUpdateUserDTO } from './dtos/update-user.dto';
import { IUserIdUpdateDTO } from './dtos/user-id-update.dto'
import { IUpdateEventDTO } from './dtos/update-event.dto';
import { EventsRepository } from './events.repository';
import { UsersRepository } from '../users/users.repository';

export class EventsController {
  static async list(ctx: RouterContext) {
    const Events = await EventsRepository.findAll();
    ctx.body = Events;
  }

  static async detail(ctx: RouterContext) {
    const { event } = ctx.state;
    ctx.body = event;
  }

  static async update(ctx: RouterContext) {
    const data = <IUpdateEventDTO>ctx.request.body;
    const event = await EventsRepository.update(ctx.params.id, data);
    ctx.body = event;
  }

  static async updateUserIDs(ctx: RouterContext) {
    const userID = <string>ctx.request.body.id
    const res = await EventsRepository.updateUserIDs(ctx.params.id, userID)
    const userRes = await UsersRepository.updateEventIDs(ctx.params.id, userID)
    ctx.body = {res, userRes};
  }

  static async getAllByUserId(ctx: RouterContext) {
    const res = await EventsRepository.findAllByUserId(ctx.params.id)
    ctx.body = res
  }

  static async delete(ctx: RouterContext) {
    await EventsRepository.delete(ctx.params.id);
    ctx.body = {
      message: 'Deleted',
    };
  }

  static async create(ctx: RouterContext) {
    const  {body} = <Request>ctx.request;
    const event = await EventsRepository.create(
      {
        name: body.name!,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        tz: body.tz,
        location: body.location,
        imgUrl: body.imgUrl,
        description: body.description,
        userIDs: []
      }
    )
    ctx.status = 201;
    ctx.body = event;
  }
}
