import { sign, SignOptions, verify } from 'jsonwebtoken';
import { environment } from '@/config/environment';
import { Accounts } from '@prisma/client';

export function generateToken(account: Accounts) {
    return new Promise((resolve, reject) => {
      const options: SignOptions = {};
      if (environment.jwt.expiration) {
        options.expiresIn = environment.jwt.expiration;
      }
      sign({ sub: account.id }, environment.jwt.secret, options, (err, token) =>
        err ? reject(err) : resolve(token),
      );
    });
  }