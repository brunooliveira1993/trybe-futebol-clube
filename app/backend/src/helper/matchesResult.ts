import Stats from './interface';

export default class TeamStats implements Stats {
  public name: string;
  public totalPoints = 0;
  public totalGames = 0;
  public totalVictories = 0;
  public totalDraws = 0;
  public totalLosses = 0;
  public goalsFavor = 0;
  public goalsOwn = 0;
  public goalsBalance = 0;
  declare efficiency: string;

  constructor(teamName: string, totalMatches: number) {
    this.name = teamName;
    this.totalGames = totalMatches;
  }

  public overTeam = () => {
    this.goalsBalance = this.goalsFavor - this.goalsOwn;
    this.efficiency = (
      (this.totalPoints / (this.totalGames * 3))
      * 100
    ).toFixed(2);
  };

  public winner = () => {
    this.totalPoints += 3;
    this.totalVictories += 1;
  };

  public loser = () => {
    this.totalLosses += 1;
  };

  public drawraw = () => {
    this.totalPoints += 1;
    this.totalDraws += 1;
  };
}
