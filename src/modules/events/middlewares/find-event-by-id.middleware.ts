import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { EventsRepository } from '../events.repository';

export async function findEventByIdMiddleware(ctx: RouterContext, next: Next) {
  const { id } = ctx.params;
  const event = await EventsRepository.findById(id);
  if (!event) {
    ctx.throw(404, { errors: [`event with ObjectId ${id} does not exist`] });
  } else {
    ctx.state.event = event;
    await next();
  }
}
