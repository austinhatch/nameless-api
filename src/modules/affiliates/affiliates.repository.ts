import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

// Create new affiliate (on account signup througb affiliate page)
// Update affiliate with new link (on click of 'Get Link')
// Update affiliate impressions (on link access)
// Update affiliate conversions (on successful sale. Will need to integrate with hatch's changes for stripe to take the affiliate link on sale)


export class AffiliatesRepository {



    
  static create(data: Prisma.AffiliateCreateInput) {
    return prisma.affiliate.create({
      data,
    });
  }

  static findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

//   static findAll() {
//     return prisma.user.findMany();
//   }

  static updateEventIDs(eventID: string, userID: string) {
    return prisma.user.update({
      where: {
        id: userID
      },
      data: {
        eventIDs: {
          push: eventID
        }
      },
      include: {
        events: true
      }
    })
  }

  static updateRewardIDs(rewardID: string, userID: string) {
    return prisma.user.update({
      where: {
        id: userID
      },
      data: {
        rewardIDs: {
          push: rewardID
        }
      },
      include: {
        rewards: true
      }
    })
  }

  static delete(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
