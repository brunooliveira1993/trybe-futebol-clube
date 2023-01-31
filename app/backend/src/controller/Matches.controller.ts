import { Request, Response } from 'express';
import MatcheService from '../services/Matche.service';

export default class matchController {
  constructor(private userService = new MatcheService()) { }

  static async getAll(_req: Request, res: Response) {
    const result = await MatcheService.find();
    return res.status(200).json(result);
  }

  static async getByFilter(req: Request, res: Response): Promise<Response> {
    if (!req.query.inProgress) {
      const result = await MatcheService.find();
      return res.status(200).json(result);
    }
    const filter = req.query.inProgress === 'true';
    const matches = await MatcheService.filter(filter);
    return res.status(200).json(matches);
  }

  static async createMatche(req: Request, res: Response): Promise<Response> {
    const newMatche = await MatcheService.insert(req.body);
    if (newMatche.type === 'INVALID') return res.status(422).json({ message: newMatche.message });
    return res.status(201).json(newMatche.message);
  }

  static async finishMatche(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const finished = await MatcheService.finish(Number(id));
    return res.status(200).json(finished.message);
  }

  static async updateMatche(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const goalTeam = await MatcheService.update(Number(id), req.body);
    console.log('RESULTADO:', goalTeam);
    if (goalTeam.type === 'INCORRECT') return res.status(400).json({ message: goalTeam.message });
    return res.status(200).json(goalTeam.message);
  }
}
