import { sign, SignOptions, verify } from 'jsonwebtoken';
import { environment } from '@/config/environment';
import { Accounts } from '@prisma/client';
import { AccountsRepository } from '../accounts.repository';

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

export function getAccountFromToken(token: string) {
  try {
    const decoded: any = verify(token, environment.jwt.secret);
    if (decoded.sub) {
      console.log('+++', decoded.sub);
      const account = AccountsRepository.findByAccountId(decoded.sub)
      return account
    } else {
      throw new Error('JWT does not contain the expected account id');
    }
  } catch (error) {
    throw new Error('Invalid or expired JWT');
  }
}