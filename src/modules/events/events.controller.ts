import { RouterContext } from '@koa/router';
import { Request } from 'koa';
// import { IUpdateUserDTO } from './dtos/update-user.dto';
import { IEventDTO } from './dtos/event.dto'
import { EventsRepository } from './events.repository';

export class EventsController {
  static async list(ctx: RouterContext) {
    const Events = await EventsRepository.findAll();
    ctx.body = Events;
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
        description: body.description
      }
    )
    ctx.status = 201;
    ctx.body = event;
  }
}
