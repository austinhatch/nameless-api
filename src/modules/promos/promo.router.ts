import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { isCurrentUserMiddleware } from '@/shared/middlewares/authorization/is-current-user.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { PromoCodesController } from './promo.controller';
import { findPromoByIdMiddleware } from './middlewares/find-promo-by-id.middleware';
import { IPromoDTO } from './dtos/promo.dto';
import { eventIdUpdateSchema } from './schemas/event-id-update.schema';
import { promoSchema } from './schemas/promo.schema';
import { validateUniqueAssociation } from '@/shared/middlewares/validation/validate-unique-association.middleware';
import { eventNames } from 'process';
import { findEventByIdMiddleware } from '../events/middlewares/find-event-by-id.middleware';
import { IEventIdUpdateDTO } from './dtos/event-id-update.dto';

export const promosRouter = new Router({ prefix: '/promos' });

promosRouter.get('/', PromoCodesController.list);

promosRouter.get(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findPromoByIdMiddleware,
  PromoCodesController.detail,
);

promosRouter.get(
  '/event/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  PromoCodesController.findAllByEventId,
);

promosRouter.patch(
  '/:id/addEvent',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  validateRequestBodyMiddleware<IEventIdUpdateDTO>(
    eventIdUpdateSchema.strict().noUnknown(),
  ),
  validateUniqueAssociation('promoCodes'),
  findEventByIdMiddleware,
  // isCurrentUserMiddleware,
  PromoCodesController.updateEventIDs,
);

// eventsRouter.del(
//   '/:id',
//   validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
//   findRewardByIdMiddleware,
//   isCurrentUserMiddleware,
//   RewardsController.delete,
// );

promosRouter.post(
  '/create',
  validateRequestBodyMiddleware<IPromoDTO>(
    promoSchema.strict().noUnknown(),
  ),
  // isCurrentUserMiddleware,
  PromoCodesController.create
)
