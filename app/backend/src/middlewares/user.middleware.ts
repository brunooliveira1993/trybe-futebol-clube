import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || 'jwt_secret';

const validationFilds = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  if (!body.email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  if (!body.password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  return next();
};

const validationToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }

  try {
    jwt.verify(token, secret);

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default {
  validationToken,
  validationFilds,
};
