import Team from '../database/models/Team.model';

export default class teamService {
  static async find(): Promise<unknown> {
    const findTeams = await Team.findAll();
    return findTeams;
  }
}
