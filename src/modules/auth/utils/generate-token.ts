import { sign, SignOptions, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { environment } from '@/config/environment';

export function generateToken(user: User) {
  return new Promise((resolve, reject) => {
    const options: SignOptions = {};
    if (environment.jwt.expiration) {
      options.expiresIn = environment.jwt.expiration;
    }
    sign({ sub: user.id }, environment.jwt.secret, options, (err, token) =>
      err ? reject(err) : resolve(token),
    );
  });
}

export function generateResetToken(userEmail: string) {
  const now = Math.floor(Date.now() / 1000);
  const expiresInMinutes = 10;
  const expirationTime = now + expiresInMinutes * 60;

  const payload = {
    email: userEmail,
    exp: expirationTime,
  };

  const token = sign(payload, environment.jwt.secret);
  return token;
}

export function getEmailFromToken(token: string): string {
  try {
    const decoded: any = verify(token, environment.jwt.secret);
    if (decoded.email) {
      console.log('+++', decoded.email);
      return decoded.email;
    } else {
      throw new Error('JWT does not contain the expected email claim');
    }
  } catch (error) {
    throw new Error('Invalid or expired JWT');
  }
}
