import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { isCurrentUserMiddleware } from '@/shared/middlewares/authorization/is-current-user.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { UsersController } from './users.controller';
import { findUserByIdMiddleware } from './middlewares/find-user-by-id.middleware';
import { IChangeUsernameDTO, IUpdateEmailDTO, IUpdateUserDTO, IUpdatePFPDTO, IAddEventDTO, IAddRewardDTO, IUpdateNameDTO} from './dtos/update-user.dto';
import { addEventIdSchema, addRewardIdSchema, changeEmailSchema, changePFPSchema, udpateUserSchema, updateNameSchema } from './schemas/update-user.schema';
import { changeUsernameSchema } from './schemas/update-user.schema';
import { UsersRepository } from './users.repository';

export const usersRouter = new Router({ prefix: '/users' });

usersRouter.get('/', UsersController.list);

usersRouter.get(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findUserByIdMiddleware,
  UsersController.detail,
);

usersRouter.post(
  '/change-username',
  validateRequestBodyMiddleware<IChangeUsernameDTO>(changeUsernameSchema.strict()),
  UsersController.changeUsername
)

usersRouter.patch(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  validateRequestBodyMiddleware<IUpdateUserDTO>(
    udpateUserSchema.strict().noUnknown(),
  ),
  findUserByIdMiddleware,
  isCurrentUserMiddleware,
  UsersController.update,
);

usersRouter.del(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findUserByIdMiddleware,
  isCurrentUserMiddleware,
  UsersController.delete,
);

usersRouter.post(
  '/change-email',
  validateRequestBodyMiddleware<IUpdateEmailDTO>(changeEmailSchema.strict()),
  UsersController.updateUserEmail
)

usersRouter.post(
  '/change-pfp',
  validateRequestBodyMiddleware<IUpdatePFPDTO>(changePFPSchema.strict()),
  UsersController.changePFP
)

usersRouter.post(
  '/add-event',
  validateRequestBodyMiddleware<IAddEventDTO>(addEventIdSchema.strict()),
  UsersController.addEventId
)

usersRouter.post(
  '/add-reward',
  validateRequestBodyMiddleware<IAddRewardDTO>(addRewardIdSchema.strict()),
  UsersController.addRewardId
)

usersRouter.post(
  '/update-name',
  validateRequestBodyMiddleware<IUpdateNameDTO>(updateNameSchema.strict()),
  UsersController.updateName
)