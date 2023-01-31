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
  if (victory === 'home') return calculateHomePoints(matche);
  return 0;
};

const calculateAwayVictories = async (matche: any[]) => {
  let victories = 0;
  matche.forEach((match: { homeTeamGoals: number; awayTeamGoals: number; }) => {
    if (match.homeTeamGoals < match.awayTeamGoals) victories += 1;
  });
  return victories;
};

const calculateHomeVictories = async (matche: any[]) => {
  let victories = 0;
  matche.forEach((match: { homeTeamGoals: number; awayTeamGoals: number; }) => {
    if (match.homeTeamGoals > match.awayTeamGoals) victories += 1;
  });
  return victories;
};

const getVictories = async (matche: any[], victory: string) => {
  if (victory === 'home') return calculateHomeVictories(matche);
  if (victory === 'away') return calculateAwayVictories(matche);
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
const teamHomeStats = async (matches: IMatch[], victory: string) => {
  const score = ((await getPoints(matches, victory) / (matches.length * 3)) * 100);
  const teamScore = {
    name: matches[0].homeTeam?.teamName,
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
const teamAwayStats = async (matches: IMatch[], victory: string) => {
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
  matches.forEach((match: { dataValues: { homeTeamId: number; }; }) => {
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
  matches.forEach((match: { dataValues: { awayTeamId: any; }; }) => {
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
    const awayMatches = matches.filter((match: { dataValues: any; }) => {
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
    const homeMatches = matches.filter((match: { dataValues: any; }) => {
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
    const homeScore = teamHomeStats(team, 'home');
    teams.push(homeScore);
    return null;
  });
  return teams;
};
const getAwayStats = async () => {
  const awayTeams = await awayTeamsResult();
  const teams: any = [];
  awayTeams.map((team: IMatch[]) => {
    const awayScore = teamAwayStats(team, 'away');
    teams.push(awayScore);
    return null;
  });
  return teams;
};
const createTotalStats = async (home: any, away: any) => {
  const totalPoints = home.totalPoints + away.totalPoints;
  const totalGames = home.totalGames + away.totalGames;
  const score = (totalPoints / (totalGames * 3)) * 100;
  const obj = {
    name: home.name,
    totalPoints: home.totalPoints + away.totalPoints,
    totalGames: home.totalGames + away.totalGames,
    totalVictories: home.totalVictories + away.totalVictories,
    totalDraws: home.totalDraws + away.totalDraws,
    totalLosses: home.totalLosses + away.totalLosses,
    goalsFavor: home.goalsFavor + away.goalsFavor,
    goalsOwn: home.goalsOwn + away.goalsOwn,
    goalsBalance: home.goalsBalance + away.goalsBalance,
    efficiency: Math.round(score * 100) / 100,
  };
  return obj;
};
const getAllStats = async () => {
  const homeTeams = await Promise.all(await getHomeStats());
  const awayTeams = await Promise.all(await getAwayStats());
  const newObj = homeTeams.map((home: any) => {
    const away: any = awayTeams.find((item: any) => item.name === home.name);
    const object = createTotalStats(home, away);
    return object;
  });
  return newObj;
};

export default {
  getHomeStats,
  getAwayStats,
  homeTeamsResult,
  getAllStats,
};
