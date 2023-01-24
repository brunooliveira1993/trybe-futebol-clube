import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserForToken } from './interface';

dotenv.config();

const secret = process.env.JWT_SECRET || 'jwt_secret';

// const jwtConfig = {
//   algorithm: 'HS256',
//   expiresIn: '1d',
// };

const createToken = (pass: UserForToken) => {
  const token = jwt.sign({ data: pass }, secret, {
    algorithm: 'HS256',
    expiresIn: '1d',
  });
  return token;
};

const verifyToken = (authorization: string) => {
  try {
    const payload = jwt.verify(authorization, secret);
    return payload;
  } catch (error) {
    return { isError: true };
  }
};

export { createToken, verifyToken };
