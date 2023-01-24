import Team from '../database/models/Team.model';
import { validResponse } from './interfaces';

export default class teamService {
  static async find(): Promise<unknown> {
    const teams = await Team.findAll();
    return teams;
  }

  static async findById(id: number): Promise<validResponse> {
    const team = await Team.findOne({ where: { id } });
    if (!team) return { type: 'NOT FOUND', message: 'team not found' };
    return { type: 'ok', message: team };
  }
}
