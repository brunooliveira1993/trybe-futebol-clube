// import { WhereOptions } from 'sequelize';
import Matches from '../database/models/Matches.model';
import Team from '../database/models/Team.model';
import { validResponse, Matche } from './interfaces';

export default class matcheServices {
  static async find(): Promise<Matches[]> {
    const matches = await Matches.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  static async filter(inProgress: boolean): Promise<Matches[]> {
    const matches = await Matches.findAll({ where: { inProgress },
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ] });
    return matches;
  }

  static async insert({ homeTeamId, awayTeamId,
    homeTeamGoals, awayTeamGoals }: Matche): Promise<validResponse> {
    const inProgress = true;
    if (!homeTeamId || !awayTeamId || !homeTeamGoals || !awayTeamGoals) {
      return { type: 'REQUIRED', message: 'is required' };
    }
    const newMatche = await Matches.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    });
    return { type: 'ok', message: newMatche };
  }
}
