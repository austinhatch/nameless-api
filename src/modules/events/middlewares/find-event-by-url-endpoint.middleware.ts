import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { EventsRepository } from '../events.repository';

export async function findEventByUrlEndpointMiddleware(ctx: RouterContext, next: Next) {
  const { url_endpoint } = ctx.params;
  const event = await EventsRepository.findByUrlEndpoint(url_endpoint);
  if (!event) {
    ctx.throw(404, { errors: [`event with url_endpoint ${url_endpoint} does not exist`] });
  } else {
    ctx.state.event = event;
    await next();
  }
}
