import Router from '@koa/router';
import { object } from 'yup';
import { validateRequestBodyMiddleware } from '@/shared/middlewares/validation/validate-request-body.middleware';
import { validateRequestParamsMiddleware } from '@/shared/middlewares/validation/validate-request-params.middleware';
import { isCurrentUserMiddleware } from '@/shared/middlewares/authorization/is-current-user.middleware';
import { objectId } from '@/shared/yup/custom-schemas/object-id.schema';
import { RewardsController } from './rewards.controller';
import { findRewardByIdMiddleware } from './middlewares/find-reward-by-id.middleware';
import { IRewardDTO } from './dtos/reward.dto';
import { rewardSchema } from './schemas/reward.schema';
import { userIdUpdateSchema } from './schemas/user-id-update.schema';
import { IUserIdUpdateDTO } from './dtos/user-id-update.dto';
import { validateUniqueAssociation } from '@/shared/middlewares/validation/validate-unique-association.middleware';

export const rewardsRouter = new Router({ prefix: '/rewards' });

rewardsRouter.get('/', RewardsController.list);

rewardsRouter.get(
  '/:id',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  findRewardByIdMiddleware,
  RewardsController.detail,
);

rewardsRouter.patch(
  '/:id/addUser',
  validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
  validateRequestBodyMiddleware<IUserIdUpdateDTO>(
    userIdUpdateSchema.strict().noUnknown(),
  ),
  validateUniqueAssociation('rewards'),
  findRewardByIdMiddleware,
  // isCurrentUserMiddleware,
  RewardsController.updateUserIDs,
);

// eventsRouter.del(
//   '/:id',
//   validateRequestParamsMiddleware<{ id: unknown }>(object({ id: objectId() })),
//   findRewardByIdMiddleware,
//   isCurrentUserMiddleware,
//   RewardsController.delete,
// );

rewardsRouter.post(
  '/create',
  validateRequestBodyMiddleware<IRewardDTO>(
    rewardSchema.strict().noUnknown(),
  ),
  // isCurrentUserMiddleware,
  RewardsController.create
)
