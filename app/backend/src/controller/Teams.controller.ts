import { Request, Response } from 'express';
import TeamService from '../services/Team.service';

export default class teamController {
  constructor(private userService = new TeamService()) { }

  static async getAll(_req: Request, res: Response) {
    const result = await TeamService.find();
    return res.status(200).json(result);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const result = await TeamService.findById(Number(id));
    if (result.type === 'NOT FOUND') return res.status(400).json(result.message);
    return res.status(200).json(result.message);
  }
}
