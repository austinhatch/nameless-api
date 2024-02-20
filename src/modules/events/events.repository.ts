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

  static findByUrlEndpoint(url_endpoint: string) {
    return prisma.event.findUnique({
      where: {
        url_endpoint,
      },
    })
  }

  static findByKydId(kyd_id: string) {
    return prisma.event.findUnique({
      where: {
        kyd_id,
      },
    })
  }

  static findAll() {
    return prisma.event.findMany();
  }

  static findAllLive() {
    return prisma.event.findMany({
      where: {
        live: true
      }
    });
  }


  static update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: {
        id,
      },
      data
    });
  }

  static delete(id: string) {
    return prisma.event.delete({
      where: {
        id,
      },
    });
  }
}
