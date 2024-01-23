import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

export class PromoCodesRepository {
  static create(data: Prisma.PromoCodesCreateInput) {
    return prisma.promoCodes.create({
      data,
    });
  }

  static findById(id: string) {
    return prisma.promoCodes.findUnique({
      where: {
        id,
      },
    });
  }

  static findAll() {
    return prisma.promoCodes.findMany();
  }


  static updateEventIDs(id: string, eventID: string) {
    return prisma.promoCodes.update({
      where: {
        id
      },
      data: {
        eventIDs: {
          push: eventID
        }
      },
    })
  }

  static findAllByEventId(id: string) {
    return prisma.promoCodes.findMany({
      where: {
        eventIDs: {
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
