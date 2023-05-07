import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

export class EventsRepository {
  static create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
    });
  }

  static findById(id: string) {
    return prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  static findAllByUserId(id: string) {
    return prisma.event.findMany({
      where: {
        userIDs: {
          has: id
        }
      }
    })
  }

  static findAll() {
    return prisma.event.findMany();
  }

  static update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: {
        id,
      },
      data
    });
  }

  static updateUserIDs(id: string, userID: string) {
    return prisma.event.update({
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

  static delete(id: string) {
    return prisma.event.delete({
      where: {
        id,
      },
    });
  }
}
