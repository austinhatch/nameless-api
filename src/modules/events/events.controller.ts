import { RouterContext } from '@koa/router';
import { Request } from 'koa';
// import { IUpdateUserDTO } from './dtos/update-user.dto';
import { IUserIdUpdateDTO } from './dtos/user-id-update.dto'
import { IUpdateEventDTO } from './dtos/update-event.dto';
import { EventsRepository } from './events.repository';
import { UsersRepository } from '../users/users.repository';
import { IEventDTO } from './dtos/event.dto';

export class EventsController {
  static async list(ctx: RouterContext) {
    const Events = await EventsRepository.findAll();
    ctx.body = Events;
  }

  static async liveList(ctx: RouterContext) {
    const Events = await EventsRepository.findAllLive();
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

  static async delete(ctx: RouterContext) {
    await EventsRepository.delete(ctx.params.id);
    ctx.body = {
      message: 'Deleted',
    };
  }

  static async create(ctx: RouterContext) {
    const body = <IEventDTO>JSON.parse(ctx.request.body);
    const event = await EventsRepository.create(
      {
        url_endpoint: body.url_endpoint,
        name: body.name,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime ? body.endTime : '',
        tz: body.tz,
        type: body.type ? body.type : '',
        location: body.location,
        location_url: body.location_url,
        venue: body.venue,
        venue_url: body.venue_url,
        imgUrl: body.imgUrl,
        description: body.description,
        rsvpDescription: body.rsvpDescription,
        claimDescription: body.claimDescription,

        priceUSD: body.priceUSD,
        email_template: body.email_template,
        cardColor: body.cardColor,

        vendors: [],

      }
    )
    ctx.status = 201;
    ctx.body = event;
  }
}
