import { Role } from "./role";

export type Participant = {
  name: string;
  role: Role;
  lastActive: string;
  avatar: string;
  active: boolean;
  social: {
    discord: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
  gamesAsRole: GameParticipation;
};

export type GameParticipation = {
  [key in Role]: number;
};
