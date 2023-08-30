import { RouterContext } from '@koa/router';
import { UsersRepository } from '../users/users.repository';
import { AffiliatesRepository } from './affiliates.repository';
import { IAffiliateLinkCreationDTO } from './dtos/link-create.dto';
import { IAffiliateLinkObject, createNewAffiliateLink } from './utils/affiliate-links-helper';

export class AffiliatesController {
  static async createLink(ctx: RouterContext) {
    const { email, eventId } = <IAffiliateLinkCreationDTO>JSON.parse(ctx.request.body);
    // check if existing affiliate
    if (AffiliatesRepository.findByEmail(email) !== null) {

    }


    const link = createNewAffiliateLink(email, eventId)

    // Update User repository. Users will have a 

    // const user = await UsersRepository.create({
    //     email,
    //     username,
    //     walletAddress,
    //     privateKey,
    //     password: hashedPassword,
    //     eventIDs: [],
    //     rewardIDs: []
    //   });
      ctx.status = 201;
      ctx.body = { link };
    }
}
