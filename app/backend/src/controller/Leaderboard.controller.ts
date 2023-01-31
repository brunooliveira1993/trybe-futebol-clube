import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderborad.service';

export default class LeaderbordController {
  static async getAllHomeResultStats(_req: Request, res: Response) {
    const result = await LeaderboardService.findAllHomeTeams();
    return res.status(200).json(result);
  }

  static async getAllAwayResultStats(_req: Request, res: Response) {
    const result = await LeaderboardService.findAllAwayTeams();
    return res.status(200).json(result);
  }

  static async getTableStats(_req: Request, res: Response) {
    const result = await LeaderboardService.getTeamStats();
    return res.status(200).json(result);
  }
}
