import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { RewardsRepository } from '../rewards.repository';

export async function findRewardByIdMiddleware(ctx: RouterContext, next: Next) {
  const { id } = ctx.params;
  const event = await RewardsRepository.findById(id);
  if (!event) {
    ctx.throw(404, { errors: [`reward with ObjectId ${id} does not exist`] });
  } else {
    ctx.state.event = event;
    await next();
  }
}
