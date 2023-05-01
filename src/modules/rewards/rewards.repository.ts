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


  // static delete(id: string) {
  //   return prisma.event.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }
}
