import { Request, Response } from 'express';
import MatcheService from '../services/Matche.service';

export default class matchController {
  constructor(private userService = new MatcheService()) { }

  static async getAll(_req: Request, res: Response) {
    const result = await MatcheService.find();
    return res.status(200).json(result);
  }

  static async getByFilter(req: Request, res: Response): Promise<Response> {
    const filter = req.query.inProgress === 'true';
    const matches = await MatcheService.filter(filter);
    return res.status(200).json(matches);
  }
}
