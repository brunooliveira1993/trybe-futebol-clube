export interface Login {
  email: string,
  password: string,
}

export interface validResponse {
  type: string | null,
  message: string | object,
}
