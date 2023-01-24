import * as bcrypt from 'bcryptjs';
import User from '../database/models/User.model';
import { createToken, verifyToken } from '../auth/JWTFunc';
import { Login, validResponse } from './interfaces';

export default class UserService {
  static async find(): Promise<unknown> {
    const findUser = await User.findAll();
    return findUser[0].password;
  }

  static async login(data: Login): Promise<validResponse> {
    const { email, password } = data;
    const user = await User.findOne({ where: { email } });

    if (!user) return { type: 'INCORRECT', message: 'Incorrect email or password' };
    const checkPass = bcrypt.compareSync(password, user.dataValues.password);

    if (!checkPass) {
      return { type: 'INCORRECT', message: 'Incorrect email or password' };
    }

    const { password: _password, ...userWithoutPassword } = user.dataValues;
    const token = createToken(userWithoutPassword);
    return { type: 'ok', message: token };
  }

  static async validate(token: string): Promise<validResponse> {
    const validToken = verifyToken(token);

    if (typeof validToken === 'string') {
      return { type: 'ERROR', message: 'Invalid Token' };
    }

    const user = await User.findOne({ where: { email: validToken.data.email } });

    if (!user) {
      return { type: 'ERROR', message: 'user not found' };
    }

    return { type: 'ok', message: user.dataValues.role };
  }
}
