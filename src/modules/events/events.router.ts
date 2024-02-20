import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { isCurrentUserMiddleware } from '@/shared/middlewares/authorization/is-current-user.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { EventsController } from './events.controller';
import { findEventByIdMiddleware } from './middlewares/find-event-by-id.middleware';
import { findEventByUrlEndpointMiddleware } from './middlewares/find-event-by-url-endpoint.middleware';
import { IUpdateEventDTO } from './dtos/update-event.dto';
import { updateEventSchema } from './schemas/update-event.schema';
import { IEventDTO } from './dtos/event.dto';
import { eventSchema } from './schemas/event.schema';
import { IUserIdUpdateDTO } from './dtos/user-id-update.dto';
import { userIdUpdateSchema } from './schemas/user-id-update.schema';
import { validateUniqueAssociation } from '@/shared/middlewares/validation/validate-unique-association.middleware';
import { findEventByKydIdMiddleware } from './middlewares/find-event-by-kyd-id.middleware';

export const eventsRouter = new Router({ prefix: '/events' });

eventsRouter.get('/', EventsController.list);

eventsRouter.get('/live', EventsController.liveList);

eventsRouter.get(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findEventByIdMiddleware,
  EventsController.detail,
);

eventsRouter.get(
  '/url/:url_endpoint',
  findEventByUrlEndpointMiddleware,
  EventsController.detail,
);

eventsRouter.get(
  '/kyd_id/:kyd_id',
  findEventByKydIdMiddleware,
  EventsController.detail
)

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

eventsRouter.del(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findEventByIdMiddleware,
  isCurrentUserMiddleware,
  EventsController.delete,
);

// eventsRouter.post(
//   '/create',
//   validateRequestBodyMiddleware<IEventDTO>(
//     eventSchema.strict().noUnknown(),
//   ),
//   // isCurrentUserMiddleware,
//   EventsController.create
// )
