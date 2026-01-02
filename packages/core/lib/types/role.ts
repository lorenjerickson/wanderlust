export enum RoleName {
  Admin = 'admin',
  GameMaster = 'gamemaster',
  Player = 'player',
  Spectator = 'spectator',
}

export type Role = {
  _id?: string
  name: RoleName
  description?: string
}
