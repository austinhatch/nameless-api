export interface IUpdateUserDTO {
  name?: string;
  lastName?: string;
}

export interface IChangeUsernameDTO {
  id: string;
  username: string;
}

export interface ICheckUsernameDTO {
  username: string
}

export interface IUpdateEmailDTO {
  id: string
  email: string
}

export interface IUpdatePFPDTO {
  id:string
  pfpAddress:string
  chain:string
}