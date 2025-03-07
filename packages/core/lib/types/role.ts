export enum RoleName {
  GlobalAdmin = "globalAdmin",
  LocalAdmin = "localAdmin",
  GameMaster = "gamemaster",
  Player = "player",
  Spectator = "spectator",  
}

export type Role = {
  name: RoleName;
  description?: string;
}
