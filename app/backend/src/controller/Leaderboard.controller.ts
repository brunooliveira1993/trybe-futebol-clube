import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderborad.service';

export default class LeaderbordController {
  static async getAll(_req: Request, res: Response) {
    const result = await LeaderboardService.findAll();
    return res.status(200).json(result);
  }
}
