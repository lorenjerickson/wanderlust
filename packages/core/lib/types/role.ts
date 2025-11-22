export const enum RoleName {
  GlobalAdmin = "globalAdmin",
  LocalAdmin = "localAdmin",
  GameMaster = "gamemaster",
  Player = "player",
  Spectator = "spectator",  
}

export type Role = {
  _id: string;
  name: RoleName;
  description?: string;
}
