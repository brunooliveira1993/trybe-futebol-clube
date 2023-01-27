import Matches from '../database/models/Matches.model';
import TeamModel from '../database/models/Team.model';
import { IMatch } from './interface';

const getTotalPoints = async (matche: any[]) => {
  let points = 0;
  matche.forEach((match: { homeTeamGoals: number; awayTeamGoals: number; }) => {
    if (match.homeTeamGoals > match.awayTeamGoals) points += 3;
    if (match.homeTeamGoals === match.awayTeamGoals) points += 1;
  });
  return points;
};

const getTotalVictories = async (matche: any[]) => {
  let victories = 0;
  matche.forEach((match) => {
    if (match.homeTeamGoals > match.awayTeamGoals) victories += 1;
  });
  return victories;
};

// const getTotalAwayVictories = async (matche: any[]) => {
//   let victories = 0;
//   matche.forEach((match) => {
//     console.log(match);
//     console.log(match.awayTeamGoals);
//     if (match.homeTeamGoals < match.awayTeamGoals) victories += 1;
//   });
//   console.log(victories);
//   return victories;
// };

const getTotalDraws = async (matche: any[]) => {
  let draws = 0;
  matche.forEach((match) => {
    if (match.homeTeamGoals === match.awayTeamGoals) draws += 1;
  });
  return draws;
};

const getTotalLoses = async (matche: any[]) => {
  let loses = 0;
  matche.forEach((match) => {
    if (match.homeTeamGoals < match.awayTeamGoals) loses += 1;
  });
  return loses;
};

const getGoalsFavor = async (matche: any[]) => {
  let goalsFavor = 0;
  matche.forEach((match) => {
    goalsFavor += match.homeTeamGoals;
  });
  return goalsFavor;
};

const getGoalsOwn = async (matche: any[]) => {
  let goalsOwn = 0;
  matche.forEach((match) => {
    goalsOwn += match.awayTeamGoals;
  });
  return goalsOwn;
};

const teamStats = async (homeMatches: IMatch[]) => {
  const score = ((await getTotalPoints(homeMatches) / (homeMatches.length * 3)) * 100);
  const teamScore = {
    name: homeMatches[0].homeTeam?.teamName,
    totalPoints: await getTotalPoints(homeMatches),
    totalGames: homeMatches.length,
    totalVictories: await getTotalVictories(homeMatches),
    totalDraws: await getTotalDraws(homeMatches),
    totalLosses: await getTotalLoses(homeMatches),
    goalsFavor: await getGoalsFavor(homeMatches),
    goalsOwn: await getGoalsOwn(homeMatches),
    goalsBalance: await getGoalsFavor(homeMatches) - await getGoalsOwn(homeMatches),
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

const getMatches = async () => {
  const homeTeams = await homeTeamsResult();
  const teams: any = [];
  homeTeams.map((team: IMatch[]) => {
    const teamScore = teamStats(team);
    teams.push(teamScore);
    return null;
  });
  return teams;
};

export default {
  getTotalPoints,
  getMatches,
  getAwayTeams,
  finishMatches,
};
