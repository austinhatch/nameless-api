import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';

export class AccountsRepository {
  static create(data: Prisma.AccountsCreateInput) {
    return prisma.accounts.create({
      data,
    });
  }

  static findById(id: string) {
    return prisma.accounts.findUnique({
      where: {
        id,
      },
    });
  }

  static findByEmail(email: string) {
    return prisma.accounts.findUnique({
      where: {
        email: email,
      },
    });
  }

  static findByAccountId(accountId: string) {
    console.log(accountId)
    return prisma.accounts.findUnique({
      where: {
        account_id: accountId,
      },
    }); 
  }

  static update(id: string, data: Prisma.AccountsUpdateInput) {
    return prisma.accounts.update({
      where: {
        id,
      },
      data,
    });
  }

  static findAll() {
    return prisma.accounts.findMany();
  }

  static delete(id: string) {
    return prisma.accounts.delete({
      where: {
        id,
      },
    });
  }
}
