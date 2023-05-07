import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

export class RewardsRepository {
  static create(data: Prisma.RewardCreateInput) {
    return prisma.reward.create({
      data,
    });
  }

  static findById(id: string) {
    return prisma.reward.findUnique({
      where: {
        id,
      },
    });
  }

  static findAll() {
    return prisma.reward.findMany();
  }


  static updateUserIDs(id: string, userID: string) {
    return prisma.reward.update({
      where: {
        id
      },
      data: {
        userIDs: {
          push: userID
        }
      },
      include: {
        users: true
      }
    })
  }

  static findAllByUserId(id: string) {
    return prisma.reward.findMany({
      where: {
        userIDs: {
          has: id
        }
      }
    })
  }


  // static delete(id: string) {
  //   return prisma.event.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }
}
