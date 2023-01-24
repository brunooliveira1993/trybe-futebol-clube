import Matches from '../database/models/Matches.model';
// import { validResponse } from './interfaces';

export default class matcheServices {
  static async find(): Promise<unknown> {
    const teams = await Matches.findAll();
    // includes: [
    //   { model: Team, as: 'team', teamName: { where:  } },
    // ]
    return teams;
  }
}
