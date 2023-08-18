/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  port: Number(process.env.PORT || 8000),
  app: {
    name: process.env.APP_NAME || 'Nameless API',
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiration: process.env.JWT_EXPIRATION || 10000,
  },
  pk: process.env.PK!,
  thirdweb: {
    secret: process.env.THIRDWEB_SECRET_KEY!
  }
};
