import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client.prisma';
import { sha256Hash } from './utils/sha256_hash';

export class KYD_UsersRepository {
  static create(data: Prisma.KYD_UserCreateInput) {
    return prisma.kYD_User.create({
      data,
    });
  }

  static findById(id: string) {
    return prisma.kYD_User.findUnique({
      where: {
        id,
      },
    });
  }

  static findByEmail(email_input: string) {
    const emailHash = sha256Hash(email_input)
    console.log("Checking for email hash", emailHash)
    return prisma.kYD_User.findMany({
      where: {
        email: emailHash,
      },
    });
  }

  static findByPhone(phone_input: string) {
    const phoneHash = sha256Hash(phone_input)
    console.log("Checking for phone hash", phoneHash)
    return prisma.kYD_User.findMany({
      where: {
        phone: phoneHash,
      },
    }); 
  }

  static findAll() {
    return prisma.kYD_User.findMany();
  }

  static delete(id: string) {
    return prisma.kYD_User.delete({
      where: {
        id,
      },
    });
  }
}
