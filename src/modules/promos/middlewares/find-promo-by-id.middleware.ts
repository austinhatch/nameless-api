import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { PromoCodesRepository } from '../promo.repository';

export async function findPromoByIdMiddleware(ctx: RouterContext, next: Next) {
  const { id } = ctx.params;
  const promo = await PromoCodesRepository.findById(id);
  if (!promo) {
    ctx.throw(404, { errors: [`promo with ObjectId ${id} does not exist`] });
  } else {
    ctx.state.event = event;
    await next();
  }
}
