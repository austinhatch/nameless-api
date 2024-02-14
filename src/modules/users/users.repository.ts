import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

export class UsersRepository {
  static create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
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

  static findByPhone(phone: string) {
    return prisma.user.findUnique({
      where: {
        phone,
      },
    });
  }

  static findByUsername(username: string) {
    return prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  static findAll() {
    return prisma.user.findMany();
  }

  static update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  static updateEventIDs(eventID: string, userID: string) {
    return prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        eventIDs: {
          push: eventID,
        },
      },
    });
  }

  static updateRewardIDs(rewardID: string, userID: string) {
    return prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        rewardIDs: {
          push: rewardID,
        },
      },
    });
  }

  static delete(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
