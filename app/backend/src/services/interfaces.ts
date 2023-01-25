export interface Login {
  email: string,
  password: string,
}

export interface validResponse {
  type: string | null,
  message: string | object,
}

export interface Matche {
  homeTeamId: number,
  awayTeamId: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
}
