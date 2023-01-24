import { Request, Response } from 'express';
import UserService from '../services/User.service';

export default class UserController {
  constructor(private userService = new UserService()) { }

  static async getAll(_req: Request, res: Response) {
    const result = await UserService.find();
    return res.status(200).json(result);
  }

  static async login(req: Request, res: Response) {
    const result = await UserService.login(req.body);
    if (result.type === 'INCORRECT') return res.status(401).json({ message: result.message });
    return res.status(200).json({ token: result.message });
  }

  static async validate(req: Request, res: Response) {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ message: 'Token not found' });
    const result = await UserService.validate(token);
    if (result.type === 'ERROR') return res.status(401).json({ message: result.message });
    return res.status(200).json({ role: result.message });
  }
}
