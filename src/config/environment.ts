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
  evm_private_key: process.env.EVM_PRIVATE_KEY!,
  aptos_private_key: process.env.APTOS_PRIVATE_KEY!,
  aptos_private_key_jesse: process.env.APTOS_PRIVATE_KEY_JESSE!,
  thirdweb: {
    secret: process.env.THIRDWEB_SECRET_KEY!,
    client: process.env.THIRDWEB_CLIENT!,
  },
};
