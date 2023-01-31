import stats from '../helper/teamStats';

export default class LeaderboardService {
  static async findAllHomeTeams() {
    const result = await stats.getHomeStats();
    const homeTeamsStats = Promise.all(result);
    (await homeTeamsStats).sort((a: any, b: any) => a.goalsOwn - b.goalsOwn);
    (await homeTeamsStats).sort((a: any, b: any) => b.goalsFavor - a.goalsFavor);
    (await homeTeamsStats).sort((a: any, b: any) => b.goalsBalance - a.goalsBalance);
    (await homeTeamsStats).sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    return homeTeamsStats;
    // const result = await stats.homeTeamsResult();
    // return result;
  }

  static async findAllAwayTeams() {
    const result = await stats.getAwayStats();
    const awayTeamsStats = Promise.all(result);
    (await awayTeamsStats).sort((a: any, b: any) => a.goalsOwn - b.goalsOwn);
    (await awayTeamsStats).sort((a: any, b: any) => b.goalsFavor - a.goalsFavor);
    (await awayTeamsStats).sort((a: any, b: any) => b.goalsBalance - a.goalsBalance);
    (await awayTeamsStats).sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    return awayTeamsStats;
  }

  static async getTeamStats() {
    const teste = await stats.teste();
    const test = Promise.all(teste);
    return test;
  }
}
