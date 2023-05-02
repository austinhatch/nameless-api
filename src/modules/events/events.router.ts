import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { isCurrentUserMiddleware } from '@/shared/middlewares/authorization/is-current-user.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { EventsController } from './events.controller';
import { findEventByIdMiddleware } from './middlewares/find-event-by-id.middleware';
import { IUpdateEventDTO } from './dtos/update-event.dto';
import { updateEventSchema } from './schemas/update-event.schema';
import { IEventDTO } from './dtos/event.dto';
import { eventSchema } from './schemas/event.schema';
import { IUserIdUpdateDTO } from './dtos/user-id-update.dto';
import { userIdUpdateSchema } from './schemas/user-id-update.schema';

export const eventsRouter = new Router({ prefix: '/events' });

eventsRouter.get('/', EventsController.list);

eventsRouter.get(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findEventByIdMiddleware,
  EventsController.detail,
);

eventsRouter.patch(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  validateRequestBodyMiddleware<IUpdateEventDTO>(
    updateEventSchema.strict().noUnknown(),
  ),
  findEventByIdMiddleware,
  // isCurrentUserMiddleware,
  EventsController.update,
);

eventsRouter.patch(
  '/:id/addUser',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  validateRequestBodyMiddleware<IUserIdUpdateDTO>(
    userIdUpdateSchema.strict().noUnknown(),
  ),
  findEventByIdMiddleware,
  // isCurrentUserMiddleware,
  EventsController.updateUserIDs,
);

eventsRouter.del(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findEventByIdMiddleware,
  isCurrentUserMiddleware,
  EventsController.delete,
);

eventsRouter.post(
  '/create',
  validateRequestBodyMiddleware<IEventDTO>(
    eventSchema.strict().noUnknown(),
  ),
  // isCurrentUserMiddleware,
  EventsController.create
)
