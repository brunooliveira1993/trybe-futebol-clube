import Matches from '../database/models/Matches.model';
import TeamModel from '../database/models/Team.model';
import { IMatch } from './interface';

const calculateHomePoints = async (matche: any[]) => {
  let points = 0;
  matche.forEach((match: { homeTeamGoals: number; awayTeamGoals: number; }) => {
    if (match.homeTeamGoals > match.awayTeamGoals) points += 3;
    if (match.homeTeamGoals === match.awayTeamGoals) points += 1;
  });
  return points;
};

const calculateAwayPoints = async (matche: any[]) => {
  let points = 0;
  matche.forEach((match: { homeTeamGoals: number; awayTeamGoals: number; }) => {
    if (match.homeTeamGoals < match.awayTeamGoals) points += 3;
    if (match.homeTeamGoals === match.awayTeamGoals) points += 1;
  });
  return points;
};

const getPoints = async (matche: any[], victory: string) => {
  if (victory === 'away') return calculateAwayPoints(matche);
  return calculateHomePoints(matche);
};

const getVictories = async (matche: any[], victory: string) => {
  let victories = 0;
  if (victory === 'away') {
    matche.forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) victories += 1;
    });
  }
  if (victory === 'home') {
    matche.forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) victories += 1;
    });
  }
  return victories;
};

const getDraws = async (matche: any[], _victory: string) => {
  let draws = 0;
  matche.forEach((match) => {
    if (match.homeTeamGoals === match.awayTeamGoals) draws += 1;
  });
  return draws;
};

const getLoses = async (matche: any[], victory: string) => {
  let loses = 0;
  if (victory === 'away') {
    matche.forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) loses += 1;
    });
  }
  if (victory === 'home') {
    matche.forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) loses += 1;
    });
  }
  return loses;
};

const getGoalsFavor = async (matche: any[], victory: string) => {
  let goalsFavor = 0;
  if (victory === 'away') {
    matche.forEach((match) => {
      goalsFavor += match.awayTeamGoals;
    });
  }
  if (victory === 'home') {
    matche.forEach((match) => {
      goalsFavor += match.homeTeamGoals;
    });
  }
  return goalsFavor;
};

const getGoalsOwn = async (matche: any[], victory: string) => {
  let goalsOwn = 0;
  if (victory === 'away') {
    matche.forEach((match) => {
      goalsOwn += match.homeTeamGoals;
    });
  }
  if (victory === 'home') {
    matche.forEach((match) => {
      goalsOwn += match.awayTeamGoals;
    });
  }
  return goalsOwn;
};

const teamStats = async (matches: IMatch[], victory: string) => {
  const score = ((await getPoints(matches, victory) / (matches.length * 3)) * 100);
  const teamScore = {
    name: matches[0].awayTeam?.teamName,
    totalPoints: await getPoints(matches, victory),
    totalGames: matches.length,
    totalVictories: await getVictories(matches, victory),
    totalDraws: await getDraws(matches, victory),
    totalLosses: await getLoses(matches, victory),
    goalsFavor: await getGoalsFavor(matches, victory),
    goalsOwn: await getGoalsOwn(matches, victory),
    goalsBalance: await getGoalsFavor(matches, victory) - await getGoalsOwn(matches, victory),
    efficiency: Math.round(score * 100) / 100,
  };
  return teamScore;
};

const finishMatches = async () => {
  const matches = await Matches.findAll(
    { where: { inProgress: 'false' },
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamModel, as: 'awayTeam', attributes: ['teamName'] },
      ] },
  );
  return matches;
};

const getHomeTeams = async () => {
  const matches = await finishMatches();
  const homeTeams: number[] = [];
  matches.forEach((match) => {
    if (!homeTeams
      .includes(match.dataValues.homeTeamId)) {
      homeTeams
        .push(match.dataValues.homeTeamId);
    }
  });
  return homeTeams;
};

const getAwayTeams = async () => {
  const matches = await finishMatches();
  const awayTeams: any = [];
  matches.forEach((match) => {
    if (!awayTeams
      .includes(match.dataValues.awayTeamId)) {
      awayTeams
        .push(match.dataValues.awayTeamId);
    }
  });
  return awayTeams;
};

const awayTeamsResult = async () => {
  const awayTeams = await getAwayTeams();
  const matches = await finishMatches();
  const teams: any = [];
  awayTeams.map((team: any) => {
    const awayMatches = matches.filter((match) => {
      const { dataValues: awayTeamId } = match;
      return (awayTeamId.awayTeamId === team);
    });
    teams.push(awayMatches);
    return null;
  });
  return teams;
};

const homeTeamsResult = async () => {
  const homeTeams = await getHomeTeams();
  const matches = await finishMatches();
  const teams: any = [];
  homeTeams.map((team) => {
    const homeMatches = matches.filter((match) => {
      const { dataValues: homeTeamId } = match;
      return (homeTeamId.homeTeamId === team);
    });
    teams.push(homeMatches);
    return null;
  });
  return teams;
};

const getHomeStats = async () => {
  const homeTeams = await homeTeamsResult();
  const teams: any = [];
  homeTeams.map((team: IMatch[]) => {
    const homeScore = teamStats(team, 'home');
    teams.push(homeScore);
    return null;
  });
  return teams;
};

const getAwayStats = async () => {
  const awayTeams = await awayTeamsResult();
  const teams: any = [];
  awayTeams.map((team: IMatch[]) => {
    const awayScore = teamStats(team, 'away');
    teams.push(awayScore);
    return null;
  });
  return teams;
};

const sortTeamsStats = async () => {
  const teamsStats = await getHomeStats();
  teamsStats.sort((a: any, b: any) => a.goalsOwn - b.goalsOwn);
  teamsStats.sort((a: any, b: any) => b.goalsFavor - a.goalsFavor);
  teamsStats.sort((a: any, b: any) => b.goalsBalance - a.goalsBalance);
  teamsStats.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
};

export default {
  getHomeStats,
  getAwayStats,
  sortTeamsStats,
};
