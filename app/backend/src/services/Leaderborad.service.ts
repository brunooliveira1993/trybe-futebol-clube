import Matches from '../database/models/Matches.model';
import Stats from '../helper/interface';
// import matcheServices from './Matche.service';
import Team from '../database/models/Team.model';
// import { validResponse } from './interfaces';
import stats from '../helper/teamStats';
// import Stats from '../helper/interface'

export default class LeaderboardService {
  static async findAll() {
    const result = await stats.getMatches();
    const homeTeamsStats = Promise.all(result);
    (await homeTeamsStats).sort((a: any, b: any) => a.goalsOwn - b.goalsOwn);
    (await homeTeamsStats).sort((a: any, b: any) => b.goalsFavor - a.goalsFavor);
    (await homeTeamsStats).sort((a: any, b: any) => b.goalsBalance - a.goalsBalance);
    (await homeTeamsStats).sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    return homeTeamsStats;
  }
}
