import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { EventsRepository } from '../events.repository';

export async function findEventByKydIdMiddleware(ctx: RouterContext, next: Next) {
  const { kyd_id } = ctx.params;
  const event = await EventsRepository.findByKydId(kyd_id);
  if (!event) {
    ctx.throw(404, { errors: [`event with kyd_id ${kyd_id} does not exist`] });
  } else {
    ctx.state.event = event;
    await next();
  }
}
