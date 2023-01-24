import { Request, Response } from 'express';
import TeamService from '../services/Team.services';

export default class teamControler {
  constructor(private userService = new TeamService()) { }

  static async getAll(_req: Request, res: Response) {
    const result = await TeamService.find();
    return res.status(200).json(result);
  }
}
